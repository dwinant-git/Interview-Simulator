'use client';

import { Question, AnswerMode } from '@/lib/types';
import { MultipleChoiceOptions } from './MultipleChoiceOptions';

interface AnswerInputProps {
  question: Question;
  answerMode: AnswerMode;
  onAnswerModeChange: (mode: AnswerMode) => void;
  value: string;
  onChange: (value: string) => void;
}

export function AnswerInput({
  question,
  answerMode,
  onAnswerModeChange,
  value,
  onChange,
}: AnswerInputProps) {
  const hasMC = question.multipleChoiceOptions && question.multipleChoiceOptions.length > 0;

  return (
    <div className="space-y-4">
      {hasMC && (
        <div className="flex gap-2">
          {(['free-form', 'multiple-choice'] as AnswerMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => {
                onAnswerModeChange(mode);
                onChange('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                answerMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {mode === 'free-form' ? 'Write Your Answer' : 'Multiple Choice'}
            </button>
          ))}
        </div>
      )}

      {answerMode === 'free-form' || !hasMC ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={
            question.type === 'behavioral'
              ? 'Describe the Situation, your Task, the Actions you took, and the Result...'
              : 'Type your answer here...'
          }
          rows={9}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
        />
      ) : (
        <MultipleChoiceOptions
          options={question.multipleChoiceOptions!}
          selectedId={value}
          onSelect={onChange}
        />
      )}
    </div>
  );
}
