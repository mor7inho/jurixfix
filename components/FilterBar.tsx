'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterStatus } from '@/hooks/useFilteredCases';

interface FilterBarProps {
  disciplines: string[];
  topics: string[];
  categories: string[];
  selectedDiscipline: string | null;
  selectedTopics: string[];
  selectedCategory: string | null;
  selectedStatus?: FilterStatus | null;
  selectedSort?: 'recentes' | 'avaliados';
  caseCount?: number;
  onDisciplineChange: (discipline: string | null) => void;
  onTopicsChange: (topics: string[]) => void;
  onCategoryChange: (category: string | null) => void;
  onStatusChange?: (status: FilterStatus | null) => void;
  onSortChange?: (sort: 'recentes' | 'avaliados') => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  categories,
  topics,
  selectedCategory,
  selectedTopics,
  selectedSort = 'recentes',
  onCategoryChange,
  onTopicsChange,
  onSortChange = () => {},
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedCategory !== null ||
    selectedTopics.length > 0 ||
    selectedSort !== 'recentes';

  const shouldShowCategories = categories.length > 1;

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end flex-wrap">
      {/* Categorias - Apenas se houver mais de uma */}
      {shouldShowCategories && (
        <div className="flex flex-col gap-1 flex-1 sm:flex-initial min-w-fit">
          <label className="text-xs font-medium text-gray-600">Categorias</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className={cn(
              'px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer',
              selectedCategory
                ? 'border-teal-400 bg-teal-50 text-teal-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tópicos */}
      <div className="flex flex-col gap-1 flex-1 sm:flex-initial min-w-fit">
        <label className="text-xs font-medium text-gray-600">Tópicos</label>
        <select
          value={selectedTopics.length === 1 ? selectedTopics[0] : ''}
          onChange={(e) =>
            onTopicsChange(e.target.value ? [e.target.value] : [])
          }
          className={cn(
            'px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer',
            selectedTopics.length > 0
              ? 'border-teal-400 bg-teal-50 text-teal-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          )}
        >
          <option value="">Todos</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Ordenação */}
      <div className="flex flex-col gap-1 flex-1 sm:flex-initial min-w-fit">
        <label className="text-xs font-medium text-gray-600">Ordenar</label>
        <select
          value={selectedSort}
          onChange={(e) =>
            onSortChange(e.target.value as 'recentes' | 'avaliados')
          }
          className={cn(
            'px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer',
            selectedSort === 'avaliados'
              ? 'border-teal-400 bg-teal-50 text-teal-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          )}
        >
          <option value="recentes">Recentes</option>
          <option value="avaliados">Mais Estudados</option>
        </select>
      </div>

      {/* Botão Limpar - apenas se há filtros */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap',
            'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
          )}
        >
          <X className="w-4 h-4" />
          Limpar
        </button>
      )}
    </div>
  );
}

