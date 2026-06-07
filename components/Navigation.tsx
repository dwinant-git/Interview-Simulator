'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-white text-lg tracking-tight">
          Interview<span className="text-blue-400">AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {pathname !== '/practice' && (
            <Link
              href="/practice"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Practice
            </Link>
          )}
          <Link
            href="/onboarding"
            className="text-sm px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
          >
            {pathname === '/onboarding' ? 'Your Profile' : 'Edit Profile'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
