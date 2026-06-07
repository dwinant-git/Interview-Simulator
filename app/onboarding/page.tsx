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

const inputClass =
  'w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow';

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
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isEdit ? 'Update your profile' : 'Tell us about yourself'}
          </h1>
          <p className="text-slate-400">
            This lets us tailor questions and feedback to your specific background.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Industry or Field <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineering, Product Management, Finance, Marketing"
              value={form.industry}
              onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Experience Level <span className="text-red-400">*</span>
            </label>
            <select
              value={form.experienceLevel}
              onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value }))}
              className={inputClass}
            >
              {experienceLevels.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Career Goals <span className="text-red-400">*</span>
            </label>
            <textarea
              placeholder="e.g. Land a senior software engineering role at a growth-stage startup, focusing on backend systems"
              value={form.careerGoals}
              onChange={e => setForm(p => ({ ...p, careerGoals: e.target.value }))}
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Be specific — this directly improves question and feedback quality.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 mt-2"
          >
            {isEdit ? 'Save and Practice' : 'Start Practicing'}
          </button>
        </form>
      </div>
    </main>
  );
}
