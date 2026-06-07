'use client';

import { useState, useCallback } from 'react';
import { Question, UserProfile, AnswerMode } from '../types';

export function useStreamingFeedback() {
  const [feedback, setFeedback] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamFeedback = useCallback(async (
    question: Question,
    answer: string,
    answerMode: AnswerMode,
    userProfile: UserProfile,
  ) => {
    setFeedback('');
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, answerMode, userProfile }),
      });

      if (!response.ok) throw new Error('Failed to get feedback');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setFeedback(prev => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const resetFeedback = useCallback(() => {
    setFeedback('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return { feedback, isStreaming, error, streamFeedback, resetFeedback };
}
