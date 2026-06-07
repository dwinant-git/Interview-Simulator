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
    <div className="space-y-3">
      {options.map((opt, i) => {
        const isSelected = selectedId === opt.text;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.text)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
              isSelected
                ? 'bg-blue-500/20 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 shrink-0 align-middle ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {LABELS[i]}
            </span>
            <span className="text-sm leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}
