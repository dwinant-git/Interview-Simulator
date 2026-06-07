import { UserProfile, Question, QuestionType, Difficulty } from './types';

export function buildSystemPrompt(profile: UserProfile): string {
  return `You are an expert behavioral interview coach specializing in helping candidates land their target roles.

## Candidate Profile
- Industry / Field: ${profile.industry}
- Experience Level: ${profile.experienceLevel}
- Career Goals: ${profile.careerGoals}

Always tailor questions, distractors, and feedback to match this candidate's industry context and experience level. Use realistic, role-relevant examples.

For behavioral questions, always evaluate responses using the STAR framework (Situation, Task, Action, Result). Be specific, encouraging, and actionable in your feedback.`;
}

export function buildQuestionGenerationPrompt(
  questionType: QuestionType,
  difficulty: Difficulty,
  count: number,
  jobDescription?: string,
): string {
  const typeDescriptions: Record<QuestionType, string> = {
    behavioral: 'behavioral STAR-method questions that probe specific past experiences and accomplishments',
    case: 'open-ended case study questions that test analytical thinking and problem-solving approach',
    situational: 'situational judgment questions about hypothetical future scenarios',
  };

  const difficultyDescriptions: Record<Difficulty, string> = {
    Easy: 'straightforward scenarios with clear right approaches, common workplace situations',
    Medium: 'nuanced situations requiring trade-off thinking and stakeholder awareness',
    Hard: 'complex, ambiguous, multi-stakeholder, high-pressure scenarios with no obvious answer',
  };

  const jdSection = jobDescription
    ? `\n## Target Job Description\nGenerate questions specifically relevant to this role:\n${jobDescription.slice(0, 2500)}\n`
    : '';

  return `Generate exactly ${count} interview questions.

## Question Type
${typeDescriptions[questionType]}

## Difficulty: ${difficulty}
${difficultyDescriptions[difficulty]}
${jdSection}
Return ONLY valid JSON with no markdown code blocks, no explanation — just the raw JSON object:
{
  "questions": [
    {
      "id": "q1",
      "text": "Full interview question text here",
      "type": "${questionType}",
      "difficulty": "${difficulty}",
      "category": "e.g. Leadership, Conflict Resolution, Problem Solving",
      "multipleChoiceOptions": [
        {"id": "opt_a", "text": "A well-structured, strong answer demonstrating clear STAR elements", "isDistractor": false},
        {"id": "opt_b", "text": "A vague answer that lacks specifics or measurable results", "isDistractor": true},
        {"id": "opt_c", "text": "An answer that describes the situation well but doesn't explain personal actions taken", "isDistractor": true},
        {"id": "opt_d", "text": "A partially structured answer that misses the result or impact", "isDistractor": true}
      ]
    }
  ]
}

Requirements:
- Each question must have exactly 4 multiple-choice options: 1 strong answer (isDistractor: false) and 3 plausible-but-weaker distractors (isDistractor: true)
- Shuffle the strong option's position randomly across questions (don't always put it first)
- Make distractors realistic — common mistakes candidates actually make, not obviously wrong answers
- The question text should be a single, clear interview question`;
}

export function buildFeedbackPrompt(question: Question, answer: string): string {
  const isBehavioral = question.type === 'behavioral';
  const isMC = answer.startsWith('opt_');

  const answerSection = isMC
    ? `The candidate selected a multiple-choice option. Evaluate whether their selection reflects strong interview instincts and explain what makes the best answer superior.

Selected Option Text: ${answer}`
    : `The candidate wrote this free-form answer:

${answer}`;

  const starSection = isBehavioral
    ? `
### STAR Framework Evaluation
For each component, assess whether it was present, partial, or missing:
- **Situation**: Did they set clear context? (Who, what, when, where)
- **Task**: Did they explain their specific responsibility or challenge?
- **Action**: Did they describe concrete personal actions? (Use of "I" not "we")
- **Result**: Did they quantify or clearly describe the outcome and impact?
`
    : '';

  return `Provide detailed, constructive coaching feedback on this interview response.

## Interview Question
${question.text}
(Type: ${question.type} | Difficulty: ${question.difficulty} | Category: ${question.category ?? 'General'})

## Candidate's Response
${answerSection}

## Feedback Structure — Use These Exact Headings
${starSection}
### Strengths
List 2-3 specific things the candidate did well. Be concrete and reference their actual answer.

### Areas for Improvement
List 2-3 specific, actionable improvements with brief explanations of why they matter to interviewers.

### Stronger Opening
Show how a stronger answer might begin — write 2-3 sentences demonstrating the improvement.

### Overall Rating
Rate as one of: **Excellent** / **Good** / **Needs Work** — followed by one sentence justification.

Keep your tone encouraging and coaching-oriented. Be specific — avoid generic advice.`;
}
