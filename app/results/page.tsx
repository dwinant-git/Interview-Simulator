'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useStreamingFeedback } from '@/lib/hooks/useStreamingFeedback';
import { Question, AnswerMode } from '@/lib/types';
import { StreamingText } from '@/components/StreamingText';

const typeLabels: Record<string, string> = {
  behavioral: 'Behavioral (STAR)',
  case: 'Case Study',
  situational: 'Situational',
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
    if (!profile) {
      router.push('/onboarding');
      return;
    }

    const ctx = sessionStorage.getItem('feedback_context');
    if (!ctx) {
      router.push('/practice');
      return;
    }

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
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-5 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/practice" className="hover:text-slate-300 transition-colors">
          Practice
        </Link>
        <span>›</span>
        <span className="text-slate-400">Feedback</span>
      </div>

      {/* Question */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Question
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-500">{typeLabels[question.type]}</span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-500">{question.difficulty}</span>
          {question.category && (
            <>
              <span className="text-xs text-slate-600">·</span>
              <span className="text-xs text-slate-500">{question.category}</span>
            </>
          )}
        </div>
        <p className="text-white text-lg leading-relaxed">{question.text}</p>
      </div>

      {/* Answer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Your Answer
          {answerMode === 'multiple-choice' && (
            <span className="ml-2 normal-case font-normal text-slate-600">(multiple choice)</span>
          )}
        </p>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
      </div>

      {/* AI Feedback */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-base font-semibold text-white">AI Coaching Feedback</h2>
          {isStreaming && (
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Analyzing...
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-4">
            {error}
          </div>
        )}

        {!error && (feedback || isStreaming) && (
          <StreamingText text={feedback} isStreaming={isStreaming} />
        )}

        {!error && !feedback && !isStreaming && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-4 h-4 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
            Loading feedback...
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/practice"
          className="flex-1 py-3 text-center border border-slate-700 text-slate-300 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all text-sm"
        >
          ← Back to Practice
        </Link>
        <button
          onClick={() => {
            sessionStorage.removeItem('feedback_context');
            router.push('/practice');
          }}
          className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 text-sm"
        >
          Try Another Question
        </button>
      </div>
    </main>
  );
}
