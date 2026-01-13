'use client';

import { useState, useEffect } from 'react';
import { Award, BookOpen } from 'lucide-react';
import { Case } from '@/types/case';

interface StudyStatsProps {
  cases: Case[];
}

export default function StudyStats({ cases }: StudyStatsProps) {
  const [mastered, setMastered] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Count cases with progress 4 or 5
    let masteredCount = 0;
    cases.forEach((caseItem) => {
      const saved = localStorage.getItem(`case-progress-${caseItem.code}`);
      if (saved) {
        const progress = parseInt(saved, 10);
        if (progress >= 4) {
          masteredCount++;
        }
      }
    });
    setMastered(masteredCount);
    setMounted(true);
  }, [cases]);

  if (!mounted) {
    return null;
  }

  const percentage = cases.length > 0 ? Math.round((mastered / cases.length) * 100) : 0;

  return (
    <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Dominados */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Dominados</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {mastered}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total de Casos</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {cases.length}
            </p>
          </div>
        </div>

        {/* Progresso */}
        <div className="flex flex-col justify-center">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Progresso</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">{percentage}% concluído</p>
        </div>
      </div>
    </div>
  );
}
