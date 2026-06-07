'use client';

import { useState, useRef, useEffect } from 'react';

type VoiceState =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'preview'
  | 'transcribing'
  | 'error';

interface Props {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  firstUse?: boolean;
}

function MicIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      className="w-5 h-5 border-2 rounded-full animate-spin"
      style={{ borderColor: '#E5E5EA', borderTopColor: '#007AFF' }}
    />
  );
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Detect best supported audio format
function getSupportedMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'audio/webm';
}

export function VoiceInput({ onTranscription, disabled, firstUse }: Props) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const mimeTypeRef = useRef<string>('audio/webm');

  // Browser support check — done client-side to avoid SSR issues
  const [isSupported, setIsSupported] = useState(true);
  useEffect(() => {
    setIsSupported(
      typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== 'undefined',
    );
  }, []);

  // Cleanup on unmount or page navigation
  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // already stopped
      }
    }
    mediaRecorderRef.current = null;
  };

  const startRecording = async () => {
    if (!isSupported || disabled) return;
    setVoiceState('requesting');
    setErrorMsg('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // stop tracks after blob is captured
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      };

      recorder.start(100);
      startTimeRef.current = Date.now();
      setDuration(0);
      setVoiceState('recording');

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500);
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorMsg(
          "Microphone access was denied. Click the lock or mic icon in your browser's address bar, allow microphone access, then try again.",
        );
      } else {
        setErrorMsg(
          'Could not access your microphone. Check that no other app is using it, then try again.',
        );
      }
      setVoiceState('error');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed < 1) {
      stopStream();
      setVoiceState('idle');
      setErrorMsg('Recording too short — please speak for at least 1 second.');
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    setVoiceState('preview');
  };

  const handleReRecord = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioBlobRef.current = null;
    setDuration(0);
    setErrorMsg('');
    setVoiceState('idle');
  };

  const handleUseRecording = async () => {
    if (!audioBlobRef.current) return;
    setVoiceState('transcribing');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlobRef.current, 'recording.webm');

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Transcription failed');
      }

      const { text } = await res.json();

      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioBlobRef.current = null;
      setVoiceState('idle');
      onTranscription(text);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Transcription failed. Try again or type your answer.',
      );
      setVoiceState('error');
    }
  };

  // ── Not supported ──────────────────────────────────────────────
  if (!isSupported) {
    return (
      <p className="text-[12px] text-ios-secondary text-center py-1">
        Voice input isn&apos;t supported in this browser. Try Chrome or Safari.
      </p>
    );
  }

  // ── Idle ──────────────────────────────────────────────────────
  if (voiceState === 'idle') {
    return (
      <div className="space-y-2">
        {firstUse && !errorMsg && (
          <p className="text-[12px] text-ios-secondary text-center">
            You can also answer by voice
          </p>
        )}
        {errorMsg && (
          <p className="text-[12px] text-center" style={{ color: '#FF3B30' }}>
            {errorMsg}
          </p>
        )}
        <button
          onClick={startRecording}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-semibold transition-opacity active:opacity-70 disabled:opacity-40"
          style={{ background: '#F2F2F7', color: '#007AFF' }}
        >
          <MicIcon size={18} color="#007AFF" />
          Record Answer
        </button>
      </div>
    );
  }

  // ── Requesting permission ─────────────────────────────────────
  if (voiceState === 'requesting') {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        <Spinner />
        <span className="text-[14px] text-ios-secondary">
          Requesting microphone access…
        </span>
      </div>
    );
  }

  // ── Recording ─────────────────────────────────────────────────
  if (voiceState === 'recording') {
    return (
      <div
        className="rounded-xl p-4 space-y-4"
        style={{ border: '0.5px solid #FF3B30', background: 'rgba(255,59,48,0.04)' }}
      >
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Pulsing red dot */}
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: '#FF3B30' }}
              />
              <span
                className="relative inline-flex rounded-full h-3 w-3"
                style={{ background: '#FF3B30' }}
              />
            </span>
            <span className="text-[14px] font-semibold" style={{ color: '#FF3B30' }}>
              Recording
            </span>
          </div>
          <span
            className="text-[20px] font-semibold tabular-nums text-ios-primary"
            style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0' }}
          >
            {formatDuration(duration)}
          </span>
        </div>

        {/* Stop button */}
        <button
          onClick={stopRecording}
          className="w-full py-3.5 rounded-xl text-[15px] font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: '#FF3B30' }}
        >
          Stop Recording
        </button>
      </div>
    );
  }

  // ── Preview ───────────────────────────────────────────────────
  if (voiceState === 'preview' && audioUrl) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #E5E5EA' }}
      >
        <div className="p-4 bg-ios-bg" style={{ borderBottom: '0.5px solid #E5E5EA' }}>
          <p className="section-label mb-3">
            Preview · {formatDuration(duration)}
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            src={audioUrl}
            controls
            className="w-full"
            style={{ height: '40px', accentColor: '#007AFF' }}
          />
        </div>

        <div className="flex bg-ios-bg">
          <button
            onClick={handleReRecord}
            className="flex-1 py-3.5 text-[15px] font-medium transition-opacity active:opacity-70"
            style={{
              color: '#FF3B30',
              borderRight: '0.5px solid #E5E5EA',
            }}
          >
            Re-record
          </button>
          <button
            onClick={handleUseRecording}
            className="flex-1 py-3.5 text-[15px] font-semibold transition-opacity active:opacity-70"
            style={{ color: '#007AFF' }}
          >
            Use this recording
          </button>
        </div>
      </div>
    );
  }

  // ── Transcribing ──────────────────────────────────────────────
  if (voiceState === 'transcribing') {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <Spinner />
        <p className="text-[14px] text-ios-secondary font-medium">
          Transcribing your answer…
        </p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        border: '0.5px solid #E5E5EA',
        background: 'rgba(255,59,48,0.04)',
      }}
    >
      <div className="flex items-start gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#FF3B30"
          className="shrink-0 mt-0.5"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <p className="text-[13px] text-ios-secondary leading-relaxed">{errorMsg}</p>
      </div>
      <button
        onClick={() => {
          setVoiceState('idle');
          setErrorMsg('');
        }}
        className="text-[14px] font-semibold"
        style={{ color: '#007AFF' }}
      >
        Try Again
      </button>
    </div>
  );
}
