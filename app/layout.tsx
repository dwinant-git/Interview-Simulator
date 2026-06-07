import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'InterviewAI — AI-Powered Interview Practice',
  description:
    'Practice behavioral, case, and situational interview questions with real-time AI coaching. Tailored to your background and target role.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
