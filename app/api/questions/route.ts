import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import { buildSystemPrompt, buildQuestionGenerationPrompt } from '@/lib/prompts';
import { GenerateQuestionsRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await request.json();
    const { questionType, difficulty, jobDescription, userProfile, count = 5 } = body;

    if (!userProfile || !questionType || !difficulty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: buildSystemPrompt(userProfile),
      messages: [
        {
          role: 'user',
          content: buildQuestionGenerationPrompt(questionType, difficulty, count, jobDescription),
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    // Strip markdown code blocks if present, then parse
    const cleaned = content.text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse JSON from model response');

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Question generation error:', error);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
