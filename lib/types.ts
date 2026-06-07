export type QuestionType = 'behavioral' | 'case' | 'situational';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type AnswerMode = 'free-form' | 'multiple-choice';

export interface UserProfile {
  industry: string;
  experienceLevel: string;
  careerGoals: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isDistractor: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  category?: string;
  multipleChoiceOptions?: MultipleChoiceOption[];
}

export interface SessionState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  answerModes: Record<string, AnswerMode>;
  feedbackHistory: Record<string, string>;
  jobDescription?: string;
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface GenerateQuestionsRequest {
  questionType: QuestionType;
  difficulty: Difficulty;
  jobDescription?: string;
  userProfile: UserProfile;
  count?: number;
}

export interface FeedbackRequest {
  question: Question;
  answer: string;
  answerMode: AnswerMode;
  userProfile: UserProfile;
}
