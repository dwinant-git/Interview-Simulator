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
      if (!res.ok) throw new Error('Could not fetch URL');
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
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Job Description{' '}
        <span className="text-slate-600 normal-case font-normal">(optional)</span>
      </label>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste job URL..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFetchUrl()}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleFetchUrl}
            disabled={isFetching || !url.trim()}
            className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isFetching ? '...' : 'Fetch'}
          </button>
        </div>

        {fetchError && <p className="text-red-400 text-xs">{fetchError}</p>}

        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste job description text here..."
          rows={5}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
