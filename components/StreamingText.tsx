'use client';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return (
            <h4 key={i} className="text-white font-semibold text-base mt-5 mb-2 first:mt-0">
              {line.slice(4)}
            </h4>
          );
        }

        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="text-white font-bold text-lg mt-6 mb-2 first:mt-0">
              {line.slice(3)}
            </h3>
          );
        }

        // Bold inline items like "- **Label**: text"
        const boldBulletMatch = line.match(/^[-*]\s+\*\*(.+?)\*\*:?\s*(.*)/);
        if (boldBulletMatch) {
          return (
            <div key={i} className="flex gap-2 ml-3 text-sm">
              <span className="text-blue-400 font-semibold shrink-0 mt-0.5">•</span>
              <span>
                <span className="text-slate-200 font-medium">{boldBulletMatch[1]}:</span>
                {boldBulletMatch[2] && (
                  <span className="text-slate-400"> {boldBulletMatch[2]}</span>
                )}
              </span>
            </div>
          );
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 ml-3 text-sm text-slate-300">
              <span className="text-slate-500 shrink-0 mt-0.5">•</span>
              <span>{renderInlineBold(line.slice(2))}</span>
            </div>
          );
        }

        // Bold text like "**Excellent**"
        if (line.includes('**')) {
          return (
            <p key={i} className="text-slate-300 text-sm">
              {renderInlineBold(line)}
            </p>
          );
        }

        if (!line.trim()) return <div key={i} className="h-3" />;

        return (
          <p key={i} className="text-slate-300 text-sm">
            {line}
          </p>
        );
      })}
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-blue-400 animate-pulse align-middle" />
      )}
    </div>
  );
}

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-white font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
