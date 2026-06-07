'use client';

import { QuestionType } from '@/lib/types';

const types: { value: QuestionType; label: string; desc: string; icon: string }[] = [
  { value: 'behavioral', label: 'Behavioral', desc: 'STAR method · past experiences', icon: '⭐' },
  { value: 'case', label: 'Case Study', desc: 'Analytical · problem-solving', icon: '📊' },
  { value: 'situational', label: 'Situational', desc: 'Hypothetical scenarios', icon: '💡' },
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
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Question Type
      </label>
      <div className="space-y-2">
        {types.map(t => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
              value === t.value
                ? 'bg-blue-500/20 border-blue-500/60 text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <span className="mr-2">{t.icon}</span>
            <span className="font-medium">{t.label}</span>
            <span className="block text-xs text-slate-500 mt-0.5 ml-6">{t.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
