'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useStreamingFeedback } from '@/lib/hooks/useStreamingFeedback';
import { Question, AnswerMode } from '@/lib/types';
import { StreamingText } from '@/components/StreamingText';

const typeLabels: Record<string, string> = {
  behavioral: 'Behavioral · STAR Method',
  case: 'Case Study',
  situational: 'Situational',
};

const typeColors: Record<string, string> = {
  behavioral: '#007AFF',
  case: '#FF9500',
  situational: '#34C759',
};

export default function ResultsPage() {
  const router = useRouter();
  const { profile, isLoaded } = useUserProfile();
  const { feedback, isStreaming, error, streamFeedback } = useStreamingFeedback();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [answerMode, setAnswerMode] = useState<AnswerMode>('free-form');
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!profile) { router.push('/onboarding'); return; }

    const ctx = sessionStorage.getItem('feedback_context');
    if (!ctx) { router.push('/practice'); return; }

    try {
      const { question: q, answer: a, answerMode: m } = JSON.parse(ctx);
      setQuestion(q);
      setAnswer(a);
      setAnswerMode(m);

      if (!hasStarted.current) {
        hasStarted.current = true;
        streamFeedback(q, a, m, profile);
      }
    } catch {
      router.push('/practice');
    }
  }, [isLoaded, profile]);

  if (!isLoaded || !question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: '#E5E5EA', borderTopColor: '#007AFF' }}
        />
      </div>
    );
  }

  const color = typeColors[question.type] ?? '#007AFF';

  return (
    <main className="bg-ios-surface min-h-screen pb-28">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 bg-ios-bg"
        style={{ borderBottom: '0.5px solid #E5E5EA' }}
      >
        <button
          onClick={() => router.push('/practice')}
          className="text-[15px] font-medium mb-3 block"
          style={{ color: '#007AFF' }}
        >
          ← Practice
        </button>
        <p className="text-[12px] font-semibold uppercase tracking-[0.5px] text-ios-secondary mb-1">
          {typeLabels[question.type]}
          {question.category ? ` · ${question.category}` : ''}
        </p>
        <h1
          className="font-bold text-ios-primary"
          style={{ fontSize: '28px', letterSpacing: '-0.5px' }}
        >
          Feedback
        </h1>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Question */}
        <div>
          <span className="section-label">Question</span>
          <div className="ios-group">
            <div className="p-4">
              <p
                className="font-semibold text-ios-primary leading-snug"
                style={{ fontSize: '17px', letterSpacing: '-0.3px' }}
              >
                &ldquo;{question.text}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: `${color}15`, color }}
                >
                  {question.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answer */}
        <div>
          <span className="section-label">
            Your Answer
            {answerMode === 'multiple-choice' && (
              <span className="normal-case font-normal text-ios-tertiary ml-1">(multiple choice)</span>
            )}
          </span>
          <div className="ios-group">
            <div className="p-4">
              <p className="text-[15px] text-ios-secondary leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="section-label mb-0">AI Coaching Feedback</span>
            {isStreaming && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#007AFF' }}
              />
            )}
          </div>

          <div className="ios-group">
            <div className="p-4">
              {error && (
                <p className="text-[14px]" style={{ color: '#FF3B30' }}>
                  {error}
                </p>
              )}
              {!error && (feedback || isStreaming) && (
                <StreamingText text={feedback} isStreaming={isStreaming} />
              )}
              {!error && !feedback && !isStreaming && (
                <div className="flex items-center gap-2 text-ios-secondary text-[14px]">
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: '#E5E5EA', borderTopColor: '#007AFF' }}
                  />
                  Analyzing your answer...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            onClick={() => {
              sessionStorage.removeItem('feedback_context');
              router.push('/practice');
            }}
            className="btn-primary"
          >
            Try Another Question
          </button>
          <button
            onClick={() => router.push('/practice')}
            className="btn-ghost block w-full text-center"
          >
            Back to Practice
          </button>
        </div>
      </div>
    </main>
  );
}
