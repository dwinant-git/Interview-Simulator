import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InterviewAI — AI-Powered Interview Practice',
  description:
    'Practice behavioral, case, and situational interview questions with real-time AI coaching. Tailored to your background and target role.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
