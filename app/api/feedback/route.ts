import { NextRequest } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import { buildSystemPrompt, buildFeedbackPrompt } from '@/lib/prompts';
import { FeedbackRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    const { question, answer, userProfile } = body;

    if (!question || !answer || !userProfile) {
      return new Response('Missing required fields', { status: 400 });
    }

    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      system: buildSystemPrompt(userProfile),
      messages: [
        {
          role: 'user',
          content: buildFeedbackPrompt(question, answer),
        },
      ],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Feedback streaming error:', error);
    return new Response('Failed to generate feedback', { status: 500 });
  }
}
