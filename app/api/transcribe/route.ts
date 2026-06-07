import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';

// Map browser MIME types to Anthropic-accepted media types
const MIME_MAP: Record<string, string> = {
  'audio/webm': 'audio/webm',
  'audio/webm;codecs=opus': 'audio/webm',
  'audio/ogg': 'audio/ogg',
  'audio/ogg;codecs=opus': 'audio/ogg',
  'audio/mp4': 'audio/mp4',
  'audio/mpeg': 'audio/mpeg',
  'audio/wav': 'audio/wav',
};

function resolveMediaType(rawType: string): string {
  const base = rawType.split(';')[0].trim().toLowerCase();
  return MIME_MAP[rawType.toLowerCase()] ?? MIME_MAP[base] ?? 'audio/webm';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Size guard — Anthropic caps base64 content; 25 MB is a safe ceiling
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Recording too large. Please keep responses under a few minutes.' },
        { status: 413 },
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const mediaType = resolveMediaType(audioFile.type);

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please transcribe this audio recording word for word. Return only the spoken text as plain prose — no labels, no timestamps, no commentary.',
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {
              type: 'audio' as any,
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Audio,
              },
            } as any,
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from model');
    }

    const transcription = content.text.trim();
    if (!transcription) {
      return NextResponse.json(
        { error: 'No speech detected in the recording. Please try again.' },
        { status: 422 },
      );
    }

    return NextResponse.json({ text: transcription });
  } catch (error: unknown) {
    console.error('Transcription error:', error);

    // Surface Anthropic API errors clearly
    if (
      error instanceof Error &&
      error.message.includes('audio')
    ) {
      return NextResponse.json(
        {
          error:
            'Audio transcription is not supported by the current model configuration. Please type your answer instead.',
        },
        { status: 501 },
      );
    }

    return NextResponse.json(
      { error: 'Transcription failed. Please type your answer instead.' },
      { status: 500 },
    );
  }
}
