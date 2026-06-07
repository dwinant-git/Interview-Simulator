import { Question } from '@/lib/types';

const typeStyles: Record<string, string> = {
  behavioral: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  case: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  situational: 'text-green-400 bg-green-400/10 border-green-400/30',
};

const difficultyStyles: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

const typeLabels: Record<string, string> = {
  behavioral: 'Behavioral (STAR)',
  case: 'Case Study',
  situational: 'Situational',
};

export function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeStyles[question.type]}`}
        >
          {typeLabels[question.type]}
        </span>
        <span className={`text-xs font-semibold ${difficultyStyles[question.difficulty]}`}>
          {question.difficulty}
        </span>
        {question.category && (
          <span className="text-xs text-slate-500">{question.category}</span>
        )}
      </div>
      <p className="text-white text-lg leading-relaxed">{question.text}</p>
      {question.type === 'behavioral' && (
        <p className="mt-3 text-xs text-slate-500">
          Tip: Structure your answer using Situation → Task → Action → Result
        </p>
      )}
    </div>
  );
}
