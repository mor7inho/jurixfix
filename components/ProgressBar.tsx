'use client';

import React, { useEffect, useState } from 'react';
import { Case } from '@/types/case';

interface ProgressBarProps {
  cases: Case[];
}

export default function ProgressBar({ cases }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedRatings = localStorage.getItem('jurisfix-ratings');
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};

    let dominado = 0;
    cases.forEach((caseItem) => {
      const rating = ratings[caseItem.slug] ?? null;
      if (rating !== null && rating >= 4) {
        dominado += 1;
      }
    });

    const percentage = (dominado / cases.length) * 100;
    setProgress(Math.round(percentage));
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">
          Sua jornada de aprendizado
        </span>
        <span className="text-xs font-semibold text-teal-700">
          {progress}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
