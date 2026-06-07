'use client';

import { Difficulty } from '@/lib/types';

const levels: { value: Difficulty; activeClass: string }[] = [
  { value: 'Easy', activeClass: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400' },
  { value: 'Medium', activeClass: 'bg-yellow-500/20 border-yellow-500/60 text-yellow-400' },
  { value: 'Hard', activeClass: 'bg-red-500/20 border-red-500/60 text-red-400' },
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
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Difficulty
      </label>
      <div className="flex gap-2">
        {levels.map(l => (
          <button
            key={l.value}
            onClick={() => onChange(l.value)}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
              value === l.value
                ? l.activeClass
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {l.value}
          </button>
        ))}
      </div>
    </div>
  );
}
