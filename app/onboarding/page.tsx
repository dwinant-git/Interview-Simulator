'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

const experienceLevels = [
  'Entry-level (0-2 years)',
  'Mid-level (3-5 years)',
  'Senior (6-10 years)',
  'Staff / Principal (10+ years)',
  'Executive / Director',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, saveProfile, isLoaded } = useUserProfile();

  const [form, setForm] = useState({
    industry: '',
    experienceLevel: experienceLevels[1],
    careerGoals: '',
  });

  useEffect(() => {
    if (isLoaded && profile) {
      setForm({
        industry: profile.industry,
        experienceLevel: profile.experienceLevel,
        careerGoals: profile.careerGoals,
      });
    }
  }, [isLoaded, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    router.push('/practice');
  };

  const isEdit = isLoaded && !!profile;

  return (
    <main className="bg-ios-surface min-h-screen pb-28">
      {/* iOS large-title header */}
      <div
        className="px-5 pt-12 pb-5 bg-ios-bg"
        style={{ borderBottom: '0.5px solid #E5E5EA' }}
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.5px] text-ios-secondary mb-1">
          {isEdit ? 'Edit Profile' : 'Getting Started'}
        </p>
        <h1
          className="font-bold text-ios-primary"
          style={{ fontSize: '32px', letterSpacing: '-0.5px' }}
        >
          {isEdit ? 'Your Profile' : 'Tell us about you'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pt-6 space-y-6">
        {/* Industry */}
        <div>
          <span className="section-label">Industry or Field</span>
          <input
            type="text"
            placeholder="e.g. Software Engineering, Finance, Marketing"
            value={form.industry}
            onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
            className="ios-input"
            required
          />
        </div>

        {/* Experience */}
        <div>
          <span className="section-label">Experience Level</span>
          <div className="ios-group">
            {experienceLevels.map(level => {
              const isActive = form.experienceLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, experienceLevel: level }))}
                  className="ios-row w-full text-left transition-colors"
                  style={{ background: isActive ? 'rgba(0,122,255,0.05)' : 'white' }}
                >
                  <span
                    className="text-[15px]"
                    style={{ color: isActive ? '#007AFF' : '#000000' }}
                  >
                    {level}
                  </span>
                  {isActive && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#007AFF">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Career Goals */}
        <div>
          <span className="section-label">Career Goals</span>
          <textarea
            placeholder="e.g. Land a senior engineering role at a growth-stage startup"
            value={form.careerGoals}
            onChange={e => setForm(p => ({ ...p, careerGoals: e.target.value }))}
            rows={4}
            className="ios-input resize-none"
            required
          />
          <p className="mt-2 text-[12px] text-ios-secondary">
            Be specific — this improves question and feedback quality.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          {isEdit ? 'Save and Practice' : 'Start Practicing'}
        </button>
      </form>
    </main>
  );
}
