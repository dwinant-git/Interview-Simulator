'use client';

import { QuestionType } from '@/lib/types';

const types: { value: QuestionType; label: string; desc: string; color: string }[] = [
  { value: 'behavioral', label: 'Behavioral', desc: 'STAR method · past experiences', color: '#007AFF' },
  { value: 'case', label: 'Case Study', desc: 'Analytical · problem-solving', color: '#FF9500' },
  { value: 'situational', label: 'Situational', desc: 'Hypothetical scenarios', color: '#34C759' },
];

export function QuestionTypeSelector({
  value,
  onChange,
}: {
  value: QuestionType;
  onChange: (v: QuestionType) => void;
}) {
  return (
    <div>
      <span className="section-label">Question Type</span>
      <div className="ios-group">
        {types.map(t => {
          const isActive = value === t.value;
          return (
            <button
              key={t.value}
              onClick={() => onChange(t.value)}
              className="ios-row w-full text-left transition-colors active:bg-ios-surface"
              style={{ background: isActive ? `${t.color}08` : 'white' }}
            >
              <div>
                <p
                  className="text-[15px] font-medium"
                  style={{ color: isActive ? t.color : '#000000' }}
                >
                  {t.label}
                </p>
                <p className="text-[12px] text-ios-secondary mt-0.5">{t.desc}</p>
              </div>
              {isActive && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill={t.color}>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
