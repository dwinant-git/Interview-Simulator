'use client';

import { MultipleChoiceOption } from '@/lib/types';

interface Props {
  options: MultipleChoiceOption[];
  selectedId: string;
  onSelect: (text: string) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

export function MultipleChoiceOptions({ options, selectedId, onSelect }: Props) {
  return (
    <div className="ios-group">
      {options.map((opt, i) => {
        const isSelected = selectedId === opt.text;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.text)}
            className="ios-row w-full text-left transition-colors active:bg-ios-surface"
            style={{
              background: isSelected ? 'rgba(0,122,255,0.06)' : 'white',
            }}
          >
            <div className="flex items-start gap-3 flex-1">
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={{
                  background: isSelected ? '#007AFF' : '#F2F2F7',
                  color: isSelected ? 'white' : '#8E8E93',
                }}
              >
                {LABELS[i]}
              </span>
              <span
                className="text-[15px] leading-snug"
                style={{ color: isSelected ? '#007AFF' : '#000000' }}
              >
                {opt.text}
              </span>
            </div>
            {isSelected && (
              <svg
                className="shrink-0 ml-2 mt-0.5"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#007AFF"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
