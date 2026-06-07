'use client';

import { useState } from 'react';
import { Question, AnswerMode } from '@/lib/types';
import { MultipleChoiceOptions } from './MultipleChoiceOptions';
import { VoiceInput } from './VoiceInput';

interface AnswerInputProps {
  question: Question;
  answerMode: AnswerMode;
  onAnswerModeChange: (mode: AnswerMode) => void;
  value: string;
  onChange: (value: string) => void;
}

// Local tab includes 'voice' — not propagated to parent's AnswerMode
type TabView = 'write' | 'voice' | 'mc';

export function AnswerInput({
  question,
  answerMode,
  onAnswerModeChange,
  value,
  onChange,
}: AnswerInputProps) {
  const hasMC = !!(question.multipleChoiceOptions?.length);

  // Derive initial tab from parent's answerMode
  const [localTab, setLocalTab] = useState<TabView>(
    answerMode === 'multiple-choice' && hasMC ? 'mc' : 'write',
  );

  // Track whether the user has ever used voice (for first-use hint)
  const [hasUsedVoice, setHasUsedVoice] = useState(false);

  const switchTab = (tab: TabView) => {
    setLocalTab(tab);
    onChange('');
    if (tab === 'mc') {
      onAnswerModeChange('multiple-choice');
    } else {
      onAnswerModeChange('free-form');
    }
  };

  const handleTranscription = (text: string) => {
    setHasUsedVoice(true);
    onChange(text);
    setLocalTab('write');
    onAnswerModeChange('free-form');
  };

  // Build the tabs list
  const tabs: { id: TabView; label: string }[] = [
    { id: 'write', label: 'Write Answer' },
    { id: 'voice', label: 'Voice' },
    ...(hasMC ? [{ id: 'mc' as TabView, label: 'Multiple Choice' }] : []),
  ];

  return (
    <div className="space-y-4">
      {/* iOS segmented control */}
      <div className="flex p-0.5 rounded-lg" style={{ background: '#E5E5EA' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className="flex-1 py-1.5 rounded-md text-[13px] font-semibold transition-all"
            style={{
              background: localTab === tab.id ? 'white' : 'transparent',
              color: localTab === tab.id ? '#000000' : '#8E8E93',
              boxShadow:
                localTab === tab.id ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {tab.id === 'voice' && localTab === 'voice' ? (
              <span className="flex items-center justify-center gap-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: '#FF3B30' }}
                />
                Voice
              </span>
            ) : (
              tab.label
            )}
          </button>
        ))}
      </div>

      {/* Write tab */}
      {localTab === 'write' && (
        <div className="space-y-3">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={
              question.type === 'behavioral'
                ? 'Describe the Situation, your Task, the Actions you took, and the Result…'
                : 'Type your answer here…'
            }
            rows={9}
            className="ios-input resize-none"
          />
          {/* Transcription filled hint */}
          {hasUsedVoice && value && (
            <p className="text-[12px] text-ios-secondary">
              Transcribed from your recording — feel free to edit.
            </p>
          )}
        </div>
      )}

      {/* Voice tab */}
      {localTab === 'voice' && (
        <VoiceInput
          onTranscription={handleTranscription}
          firstUse={!hasUsedVoice}
        />
      )}

      {/* Multiple choice tab */}
      {localTab === 'mc' && hasMC && (
        <MultipleChoiceOptions
          options={question.multipleChoiceOptions!}
          selectedId={value}
          onSelect={onChange}
        />
      )}
    </div>
  );
}
