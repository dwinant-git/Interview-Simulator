import Link from 'next/link';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#007AFF">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm-1 14v-4H7l5-8v4h4l-5 8z" />
      </svg>
    ),
    title: 'Three Question Types',
    description: 'Behavioral STAR, case studies, and situational judgment — matched to your target role.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#34C759">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12l-3-3-5 5V5h16v9l-8-3v3z" />
      </svg>
    ),
    title: 'Streaming AI Feedback',
    description: 'Real-time coaching on strengths, gaps, and STAR structure as you answer.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF9500">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
    title: 'Personalized to You',
    description: 'Questions adapt to your industry, experience level, and career goals.',
  },
];

const steps = [
  { num: '1', title: 'Set your profile', body: 'Tell us your industry and goals — 30 seconds.' },
  { num: '2', title: 'Pick your session', body: 'Choose question type, difficulty, and optionally paste a job description.' },
  { num: '3', title: 'Answer and improve', body: 'Write or choose answers, then get instant AI coaching.' },
];

export default function LandingPage() {
  return (
    <main className="bg-ios-bg pb-24">
      {/* Hero */}
      <section className="px-5 pt-14 pb-10 text-center">
        <span
          className="inline-block mb-4 text-[11px] font-semibold uppercase tracking-[1px] px-3 py-1 rounded-full"
          style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
        >
          Powered by Claude AI
        </span>
        <h1
          className="font-bold text-ios-primary mb-4"
          style={{ fontSize: '38px', lineHeight: '1.1', letterSpacing: '-1px' }}
        >
          Ace Your Next<br />Interview
        </h1>
        <p className="text-ios-secondary text-[17px] leading-relaxed max-w-sm mx-auto mb-8">
          AI-generated questions and instant personalized coaching — built around your background.
        </p>
        <Link
          href="/onboarding"
          className="inline-block px-8 py-3.5 rounded-xl font-semibold text-[17px] text-white transition-opacity active:opacity-75"
          style={{ background: '#007AFF' }}
        >
          Start Practicing Free
        </Link>
      </section>

      {/* Illustration — iOS-style app preview mockup */}
      <section className="px-5 mb-10">
        <div
          className="rounded-2xl overflow-hidden mx-auto max-w-sm"
          style={{ border: '0.5px solid #E5E5EA', background: '#F2F2F7' }}
        >
          {/* Mock header */}
          <div
            className="px-5 pt-8 pb-4"
            style={{ borderBottom: '0.5px solid #E5E5EA', background: 'white' }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.5px] text-ios-secondary mb-1">
              Behavioral Prep
            </p>
            <p
              className="font-semibold text-ios-primary"
              style={{ fontSize: '17px', letterSpacing: '-0.3px' }}
            >
              &ldquo;Tell me about a time you led a team through an unexpected challenge.&rdquo;
            </p>
          </div>
          {/* Mock feedback pill */}
          <div className="px-5 py-4 space-y-2">
            {[
              { label: 'Situation', done: true },
              { label: 'Task', done: true },
              { label: 'Action', done: false },
              { label: 'Result', done: false },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: item.done ? '#34C759' : '#E5E5EA' }}
                >
                  {item.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: item.done ? '#000000' : '#AEAEB2' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {/* Mock action bar */}
          <div
            className="px-5 py-3 flex justify-between items-center"
            style={{ borderTop: '0.5px solid #E5E5EA', background: 'white' }}
          >
            <span className="text-[12px] text-ios-secondary">Question 2 of 5</span>
            <span
              className="text-[12px] font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
            >
              Get Feedback →
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 mb-10">
        <span className="section-label">What you get</span>
        <div className="ios-group">
          {features.map((f, i) => (
            <div key={i} className="ios-row gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F2F2F7' }}>
                {f.icon}
              </div>
              <div>
                <p className="text-[15px] font-semibold text-ios-primary">{f.title}</p>
                <p className="text-[13px] text-ios-secondary mt-0.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="px-5 mb-10">
        <span className="section-label">How it works</span>
        <div className="space-y-3">
          {steps.map(s => (
            <div key={s.num} className="flex gap-4 items-start">
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold text-white mt-0.5"
                style={{ background: '#007AFF' }}
              >
                {s.num}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ios-primary">{s.title}</p>
                <p className="text-[13px] text-ios-secondary">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5">
        <Link href="/onboarding" className="btn-primary block text-center">
          Get Started
        </Link>
      </section>
    </main>
  );
}
