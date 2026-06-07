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
      {/* Mode toggle — iOS segmented control */}
      {hasMC && (
        <div
          className="flex p-0.5 rounded-lg"
          style={{ background: '#E5E5EA' }}
        >
          {(['free-form', 'multiple-choice'] as AnswerMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => {
                onAnswerModeChange(mode);
                onChange('');
              }}
              className="flex-1 py-1.5 rounded-md text-[13px] font-semibold transition-all"
              style={{
                background: answerMode === mode ? 'white' : 'transparent',
                color: answerMode === mode ? '#000000' : '#8E8E93',
                boxShadow: answerMode === mode ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              {mode === 'free-form' ? 'Write Answer' : 'Multiple Choice'}
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
          className="ios-input resize-none"
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
