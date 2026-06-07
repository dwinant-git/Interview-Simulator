'use client';

import { Difficulty } from '@/lib/types';

const levels: { value: Difficulty; color: string }[] = [
  { value: 'Easy', color: '#34C759' },
  { value: 'Medium', color: '#FF9500' },
  { value: 'Hard', color: '#FF3B30' },
];

export function DifficultySelector({
  value,
  onChange,
}: {
  value: Difficulty;
  onChange: (v: Difficulty) => void;
}) {
  return (
    <div>
      <span className="section-label">Difficulty</span>
      {/* iOS segmented control */}
      <div
        className="flex p-0.5 rounded-lg"
        style={{ background: '#E5E5EA' }}
      >
        {levels.map(l => {
          const isActive = value === l.value;
          return (
            <button
              key={l.value}
              onClick={() => onChange(l.value)}
              className="flex-1 py-1.5 rounded-md text-[13px] font-semibold transition-all"
              style={{
                background: isActive ? 'white' : 'transparent',
                color: isActive ? l.color : '#8E8E93',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              {l.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
