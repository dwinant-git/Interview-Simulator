import Link from 'next/link';

const features = [
  {
    icon: '⭐',
    title: 'Three Question Types',
    description:
      'Behavioral STAR method, open-ended case studies, and situational judgment — all matched to your target role.',
  },
  {
    icon: '🤖',
    title: 'Streaming AI Feedback',
    description:
      'Submit your answer and watch real-time coaching appear — strengths, improvements, and a STAR framework breakdown.',
  },
  {
    icon: '🎯',
    title: 'Personalized to You',
    description:
      'Questions and feedback tailored to your industry, experience level, and career goals. Paste any job description.',
  },
];

const steps = [
  { step: '1', title: 'Set your profile', desc: 'Tell us your industry and goals — takes 30 seconds.' },
  { step: '2', title: 'Generate questions', desc: 'Pick type and difficulty, optionally paste a job description.' },
  { step: '3', title: 'Answer and get coached', desc: 'Write freely or pick from multiple choice, then get AI feedback.' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[82vh] px-6 text-center relative overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <span className="inline-block mb-5 px-4 py-1.5 bg-blue-500/15 text-blue-300 rounded-full text-sm font-medium border border-blue-500/25 tracking-wide">
            Powered by Claude AI
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
            Ace Your Next<br />
            <span className="text-blue-400">Interview</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            AI-generated questions and instant personalized coaching — tailored to your role and experience level.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-400/30"
            >
              Start Practicing — It&apos;s Free
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 border border-slate-700 text-slate-300 rounded-xl font-semibold hover:border-slate-500 hover:text-white transition-all"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Ready in 3 Steps
        </h2>
        <div className="space-y-4">
          {steps.map(s => (
            <div
              key={s.step}
              className="flex items-start gap-5 bg-slate-900/40 border border-slate-800 rounded-xl p-5"
            >
              <span className="flex-shrink-0 w-9 h-9 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold border border-blue-500/30">
                {s.step}
              </span>
              <div>
                <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/onboarding"
            className="inline-block px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/25"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
