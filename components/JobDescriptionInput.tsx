'use client';

import { useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function JobDescriptionInput({ value, onChange }: Props) {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleFetchUrl = async () => {
    if (!url.trim()) return;
    setIsFetching(true);
    setFetchError('');

    try {
      const res = await fetch('/api/fetch-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.content);
      setUrl('');
    } catch {
      setFetchError('Could not fetch that URL. Try pasting the text directly.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div>
      <span className="section-label">
        Job Description{' '}
        <span className="normal-case font-normal text-ios-tertiary">(optional)</span>
      </span>

      <div className="space-y-2">
        {/* URL row */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste job URL..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFetchUrl()}
            className="ios-input flex-1 text-[13px]"
          />
          <button
            onClick={handleFetchUrl}
            disabled={isFetching || !url.trim()}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-40"
            style={{ background: '#F2F2F7', color: '#007AFF' }}
          >
            {isFetching ? '...' : 'Fetch'}
          </button>
        </div>

        {fetchError && (
          <p className="text-[12px]" style={{ color: '#FF3B30' }}>
            {fetchError}
          </p>
        )}

        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste job description text here..."
          rows={4}
          className="ios-input resize-none text-[13px]"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="text-[12px] font-medium"
            style={{ color: '#FF3B30' }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
