'use client';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return (
            <p
              key={i}
              className="section-label mt-5 first:mt-0"
            >
              {line.slice(4)}
            </p>
          );
        }

        if (line.startsWith('## ')) {
          return (
            <h3
              key={i}
              className="font-bold text-ios-primary mt-5 first:mt-0"
              style={{ fontSize: '20px', letterSpacing: '-0.3px' }}
            >
              {line.slice(3)}
            </h3>
          );
        }

        const boldBulletMatch = line.match(/^[-*]\s+\*\*(.+?)\*\*:?\s*(.*)/);
        if (boldBulletMatch) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-ios-tertiary shrink-0 mt-0.5 text-[13px]">•</span>
              <span className="text-[14px] leading-snug">
                <span className="font-semibold text-ios-primary">{boldBulletMatch[1]}:</span>
                {boldBulletMatch[2] && (
                  <span className="text-ios-secondary"> {boldBulletMatch[2]}</span>
                )}
              </span>
            </div>
          );
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-ios-tertiary shrink-0 mt-0.5 text-[13px]">•</span>
              <span className="text-[14px] text-ios-secondary leading-snug">
                {renderInlineBold(line.slice(2))}
              </span>
            </div>
          );
        }

        if (line.includes('**')) {
          return (
            <p key={i} className="text-[14px] text-ios-secondary leading-relaxed">
              {renderInlineBold(line)}
            </p>
          );
        }

        if (!line.trim()) return <div key={i} className="h-2" />;

        return (
          <p key={i} className="text-[14px] text-ios-secondary leading-relaxed">
            {line}
          </p>
        );
      })}
      {isStreaming && (
        <span
          className="inline-block w-0.5 h-3.5 align-middle ml-0.5 animate-pulse"
          style={{ background: '#007AFF' }}
        />
      )}
    </div>
  );
}

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ios-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
