import { Question } from '@/lib/types';

const typeLabels: Record<string, string> = {
  behavioral: 'STAR Method',
  case: 'Case Study',
  situational: 'Situational',
};

const typeColors: Record<string, string> = {
  behavioral: '#007AFF',
  case: '#FF9500',
  situational: '#34C759',
};

const difficultyColors: Record<string, string> = {
  Easy: '#34C759',
  Medium: '#FF9500',
  Hard: '#FF3B30',
};

export function QuestionCard({ question }: { question: Question }) {
  return (
    <div>
      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded"
          style={{
            background: `${typeColors[question.type]}15`,
            color: typeColors[question.type],
          }}
        >
          {typeLabels[question.type]}
        </span>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded"
          style={{
            background: `${difficultyColors[question.difficulty]}15`,
            color: difficultyColors[question.difficulty],
          }}
        >
          {question.difficulty}
        </span>
        {question.category && (
          <span className="text-[11px] text-ios-secondary">{question.category}</span>
        )}
      </div>

      {/* Question text */}
      <p
        className="text-ios-primary font-semibold leading-snug mb-3"
        style={{ fontSize: '20px', letterSpacing: '-0.3px' }}
      >
        &ldquo;{question.text}&rdquo;
      </p>

      {question.type === 'behavioral' && (
        <p className="text-[13px] text-ios-secondary">
          Structure your answer: Situation → Task → Action → Result
        </p>
      )}
    </div>
  );
}
