'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Case } from '@/types/case';

interface StatisticsCardsProps {
  cases: Case[];
}

export default function StatisticsCards({ cases }: StatisticsCardsProps) {
  const [completed, setCompleted] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let completedCount = 0;
    
    cases.forEach((caseItem) => {
      const saved = localStorage.getItem(`case-progress-${caseItem.code}`);
      if (saved) {
        const progress = parseInt(saved, 10);
        if (progress >= 4) {
          completedCount++;
        }
      }
    });

    setCompleted(completedCount);
    setEstimatedTime(completedCount * 5); // 5 min por caso
    setMounted(true);
  }, [cases]);

  if (!mounted) {
    return null;
  }

  const stats = [
    {
      icon: BookOpen,
      label: 'Total de Casos',
      value: cases.length,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: CheckCircle,
      label: 'Concluídos',
      value: completed,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: Clock,
      label: 'Tempo Estimado',
      value: `${estimatedTime}m`,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
