'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const STORAGE_KEY = 'interview_simulator_profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        // corrupted data — start fresh
      }
    }
    setIsLoaded(true);
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    document.cookie = 'has_profile=1; path=/; max-age=31536000; SameSite=Lax';
    setProfile(newProfile);
  };

  const clearProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = 'has_profile=; path=/; max-age=0';
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile, isLoaded };
}
