'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { Case } from '@/types/case';
import { cn } from '@/lib/utils';
import { FilterStatus } from '@/hooks/useFilteredCases';

interface StatusFilterButtonsProps {
  cases: Case[];
  selectedStatus: FilterStatus | null;
  onStatusChange: (status: FilterStatus | null) => void;
}

interface Stats {
  dominado: number;
  revisao: number;
  pendente: number;
}

export default function StatusFilterButtons({
  cases,
  selectedStatus,
  onStatusChange,
}: StatusFilterButtonsProps) {
  const [stats, setStats] = useState<Stats>({
    dominado: 0,
    revisao: 0,
    pendente: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const newStats: Stats = {
      dominado: 0,
      revisao: 0,
      pendente: 0,
    };

    // Lê ratings do novo formato (jurisfix-ratings)
    const savedRatings = localStorage.getItem('jurisfix-ratings');
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};

    cases.forEach((caseItem) => {
      const progress = ratings[caseItem.slug] ?? null;

      if (progress === null) {
        newStats.pendente += 1;
      } else if (progress >= 4) {
        newStats.dominado += 1;
      } else if (progress >= 1) {
        newStats.revisao += 1;
      }
    });

    setStats(newStats);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const statusFilters = [
    {
      key: 'dominado' as FilterStatus,
      label: 'Dominado',
      icon: CheckCircle2,
      color: 'emerald',
      count: stats.dominado,
      description: '4-5 ⭐',
    },
    {
      key: 'em-revisao' as FilterStatus,
      label: 'Em Revisão',
      icon: Clock,
      color: 'yellow',
      count: stats.revisao,
      description: '1-3 ⭐',
    },
    {
      key: 'pendente' as FilterStatus,
      label: 'Novo',
      icon: BookOpen,
      color: 'blue',
      count: stats.pendente,
      description: 'sem nota',
    },
  ];

  return (
    <div className="mb-6">
      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3">
        Filtrar por Status:
      </p>
      <div className="flex flex-wrap gap-2">
        {/* Botão "Todos" */}
        <button
          onClick={() => onStatusChange(null)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-2',
            selectedStatus === null
              ? 'bg-gray-900 text-white border-gray-900 shadow-md'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          )}
        >
          Todos ({cases.length})
        </button>

        {/* Botões de Status */}
        {statusFilters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedStatus === filter.key;
          const colorClasses: Record<string, { selected: string; unselected: string }> = {
            emerald: {
              selected: 'bg-emerald-600 text-white border-emerald-600 shadow-md',
              unselected:
                'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50',
            },
            yellow: {
              selected: 'bg-yellow-500 text-white border-yellow-500 shadow-md',
              unselected:
                'bg-white text-yellow-700 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50',
            },
            blue: {
              selected: 'bg-blue-600 text-white border-blue-600 shadow-md',
              unselected:
                'bg-white text-blue-700 border-blue-300 hover:border-blue-400 hover:bg-blue-50',
            },
          };
          const colorClass = colorClasses[filter.color] || colorClasses.emerald;

          return (
            <button
              key={filter.key}
              onClick={() => onStatusChange(filter.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-2',
                isSelected ? colorClass.selected : colorClass.unselected
              )}
            >
              <Icon className="w-4 h-4" />
              <span>
                {filter.label} ({filter.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
