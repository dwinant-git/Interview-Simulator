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

export default function PracticePage() {
  const router = useRouter();
  const { profile, isLoaded } = useUserProfile();
  const [session, setSession] = useState<SessionState>(initialSession);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const progress =
    session.questions.length > 0
      ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100
      : 0;

  if (!isLoaded || !profile) return null;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-slate-900/80 border-r border-slate-800 flex flex-col overflow-y-auto">
        <div className="p-5 space-y-6 flex-1">
          <div className="text-xs text-slate-500 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700">
            Practicing as:{' '}
            <span className="text-slate-300 font-medium">{profile.industry}</span> ·{' '}
            <span className="text-slate-400">{profile.experienceLevel}</span>
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
        </div>

        <div className="p-5 border-t border-slate-800">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>Generate Questions</>
            )}
          </button>

          {error && (
            <p className="mt-3 text-red-400 text-xs text-center">{error}</p>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {!currentQuestion ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-slate-800/60 rounded-2xl flex items-center justify-center text-4xl mb-5 border border-slate-700">
                💬
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to Practice?</h2>
              <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                Configure your session in the sidebar — choose a question type, difficulty, and
                optionally add a job description — then click Generate.
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Progress header */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Question{' '}
                  <span className="text-white font-medium">{session.currentQuestionIndex + 1}</span>{' '}
                  of {session.questions.length}
                </span>
                <div className="flex gap-1">
                  {session.questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSession(p => ({ ...p, currentQuestionIndex: i }))}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === session.currentQuestionIndex
                          ? 'bg-blue-400'
                          : session.answers[session.questions[i].id]
                            ? 'bg-slate-500'
                            : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <QuestionCard question={currentQuestion} />

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

              {/* Nav row */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => goTo(-1)}
                  disabled={session.currentQuestionIndex === 0}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  ← Previous
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="px-7 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20"
                >
                  Get AI Feedback →
                </button>

                <button
                  onClick={() => goTo(1)}
                  disabled={session.currentQuestionIndex === session.questions.length - 1}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  Skip →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {session.questions.length > 0 && (
          <div className="h-0.5 bg-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
