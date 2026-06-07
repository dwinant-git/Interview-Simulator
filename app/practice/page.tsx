'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { SessionState, QuestionType, Difficulty, AnswerMode } from '@/lib/types';
import { QuestionTypeSelector } from '@/components/QuestionTypeSelector';
import { DifficultySelector } from '@/components/DifficultySelector';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { QuestionCard } from '@/components/QuestionCard';
import { AnswerInput } from '@/components/AnswerInput';

const initialSession: SessionState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  answerModes: {},
  feedbackHistory: {},
  questionType: 'behavioral',
  difficulty: 'Medium',
};

type View = 'config' | 'question';

export default function PracticePage() {
  const router = useRouter();
  const { profile, isLoaded } = useUserProfile();
  const [session, setSession] = useState<SessionState>(initialSession);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('config');

  useEffect(() => {
    if (isLoaded && !profile) router.push('/onboarding');
  }, [isLoaded, profile, router]);

  const currentQuestion = session.questions[session.currentQuestionIndex] ?? null;
  const currentAnswer = currentQuestion ? (session.answers[currentQuestion.id] ?? '') : '';
  const currentMode: AnswerMode =
    currentQuestion ? (session.answerModes[currentQuestion.id] ?? 'free-form') : 'free-form';

  const handleGenerate = async () => {
    if (!profile) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionType: session.questionType,
          difficulty: session.difficulty,
          jobDescription: session.jobDescription,
          userProfile: profile,
          count: 5,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to generate questions');
      }

      const data = await res.json();
      if (!data.questions?.length) throw new Error('No questions returned');

      setSession(prev => ({
        ...prev,
        questions: data.questions,
        currentQuestionIndex: 0,
        answers: {},
        answerModes: {},
        feedbackHistory: {},
      }));
      setView('question');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !currentAnswer.trim()) return;
    sessionStorage.setItem(
      'feedback_context',
      JSON.stringify({
        question: currentQuestion,
        answer: currentAnswer,
        answerMode: currentMode,
      }),
    );
    router.push('/results');
  };

  const goTo = (delta: number) => {
    setSession(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(
        0,
        Math.min(prev.questions.length - 1, prev.currentQuestionIndex + delta),
      ),
    }));
  };

  if (!isLoaded || !profile) return null;

  /* ── Config view ── */
  if (view === 'config') {
    return (
      <main className="bg-ios-surface min-h-screen pb-28">
        {/* Header */}
        <div
          className="px-5 pt-12 pb-5 bg-ios-bg"
          style={{ borderBottom: '0.5px solid #E5E5EA' }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.5px] text-ios-secondary">
              Session Setup
            </p>
            {session.questions.length > 0 && (
              <button
                onClick={() => setView('question')}
                className="text-[15px] font-medium"
                style={{ color: '#007AFF' }}
              >
                Resume
              </button>
            )}
          </div>
          <h1
            className="font-bold text-ios-primary"
            style={{ fontSize: '32px', letterSpacing: '-0.5px' }}
          >
            Practice
          </h1>
        </div>

        <div className="px-5 pt-6 space-y-6">
          {/* Profile chip */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(0,122,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            <p className="text-[12px] font-medium" style={{ color: '#007AFF' }}>
              {profile.industry} · {profile.experienceLevel}
            </p>
          </div>

          <QuestionTypeSelector
            value={session.questionType}
            onChange={v => setSession(p => ({ ...p, questionType: v as QuestionType }))}
          />

          <DifficultySelector
            value={session.difficulty}
            onChange={v => setSession(p => ({ ...p, difficulty: v as Difficulty }))}
          />

          <JobDescriptionInput
            value={session.jobDescription ?? ''}
            onChange={v => setSession(p => ({ ...p, jobDescription: v }))}
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Questions'
            )}
          </button>

          {error && (
            <p className="text-[13px] text-center" style={{ color: '#FF3B30' }}>
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  /* ── Question view ── */
  return (
    <main className="bg-ios-bg min-h-screen pb-28">
      {/* Sticky question header */}
      <div
        className="sticky top-0 z-10 px-5 pt-12 pb-4 bg-ios-bg"
        style={{ borderBottom: '0.5px solid #E5E5EA' }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('config')}
            className="text-[15px] font-medium"
            style={{ color: '#007AFF' }}
          >
            ← Setup
          </button>

          {/* Dot progress */}
          <div className="flex gap-1.5 items-center">
            {session.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setSession(p => ({ ...p, currentQuestionIndex: i }))}
                className="rounded-full transition-all"
                style={{
                  width: i === session.currentQuestionIndex ? '16px' : '7px',
                  height: '7px',
                  background:
                    i === session.currentQuestionIndex
                      ? '#007AFF'
                      : session.answers[session.questions[i].id]
                        ? '#8E8E93'
                        : '#E5E5EA',
                }}
              />
            ))}
          </div>

          <span className="text-[13px] text-ios-secondary font-medium">
            {session.currentQuestionIndex + 1}/{session.questions.length}
          </span>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        {currentQuestion && (
          <>
            {/* Question card */}
            <div
              className="rounded-2xl p-5 bg-ios-bg"
              style={{ border: '0.5px solid #E5E5EA' }}
            >
              <QuestionCard question={currentQuestion} />
            </div>

            {/* Answer input */}
            <div>
              <span className="section-label">Your Answer</span>
              <AnswerInput
                question={currentQuestion}
                answerMode={currentMode}
                onAnswerModeChange={mode =>
                  setSession(p => ({
                    ...p,
                    answerModes: { ...p.answerModes, [currentQuestion.id]: mode },
                    answers: { ...p.answers, [currentQuestion.id]: '' },
                  }))
                }
                value={currentAnswer}
                onChange={val =>
                  setSession(p => ({
                    ...p,
                    answers: { ...p.answers, [currentQuestion.id]: val },
                  }))
                }
              />
            </div>

            {/* Action row */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => goTo(-1)}
                disabled={session.currentQuestionIndex === 0}
                className="flex-none w-11 h-11 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-30"
                style={{ background: '#F2F2F7' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#8E8E93">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-[15px] text-white transition-opacity disabled:opacity-40"
                style={{ background: '#34C759' }}
              >
                Get AI Feedback
              </button>

              <button
                onClick={() => goTo(1)}
                disabled={session.currentQuestionIndex === session.questions.length - 1}
                className="flex-none w-11 h-11 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-30"
                style={{ background: '#F2F2F7' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#8E8E93">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
