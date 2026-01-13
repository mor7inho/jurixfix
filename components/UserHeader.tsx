'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function UserHeader() {
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Calculate overall progress based on all saved progress in localStorage
    const keys = Object.keys(localStorage);
    let totalCases = 0;
    let totalProgress = 0;
    let completed = 0;

    keys.forEach((key) => {
      if (key.startsWith('case-progress-')) {
        const progress = parseInt(localStorage.getItem(key) || '0', 10);
        totalCases++;
        totalProgress += progress;
        if (progress >= 4) {
          completed++;
        }
      }
    });

    if (totalCases > 0) {
      const average = Math.round((totalProgress / (totalCases * 5)) * 100);
      setOverallProgress(average);
    }

    setCompletedCount(completed);
    setTotalCount(totalCases);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-shadow">
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      {/* Nome e Progresso */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
          Usuário Demo
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-emerald-600 whitespace-nowrap">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}
