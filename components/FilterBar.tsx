'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  disciplines: string[];
  topics: string[];
  selectedDiscipline: string | null;
  selectedTopics: string[];
  onDisciplineChange: (discipline: string | null) => void;
  onTopicsChange: (topics: string[]) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  disciplines,
  topics,
  selectedDiscipline,
  selectedTopics,
  onDisciplineChange,
  onTopicsChange,
  onApplyFilters,
  onClearFilters,
}: FilterBarProps) {
  const [topicSearch, setTopicSearch] = useState('');
  const [showTopicsList, setShowTopicsList] = useState(false);

  const filteredTopics = useMemo(() => {
    return topics.filter((t) =>
      t.toLowerCase().includes(topicSearch.toLowerCase())
    );
  }, [topics, topicSearch]);

  const hasActiveFilters = selectedDiscipline !== null || selectedTopics.length > 0;

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onTopicsChange(selectedTopics.filter((t) => t !== topic));
    } else {
      onTopicsChange([...selectedTopics, topic]);
    }
  };

  const handleClearAll = () => {
    onDisciplineChange(null);
    onTopicsChange([]);
    setTopicSearch('');
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar Tudo
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Matéria - Dropdown único */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Matéria Jurídica
            </label>
            <div className="relative">
              <select
                value={selectedDiscipline || ''}
                onChange={(e) => {
                  const newDiscipline = e.target.value || null;
                  onDisciplineChange(newDiscipline);
                  // Clear topics when discipline changes
                  onTopicsChange([]);
                  setTopicSearch('');
                  // Open topics list if discipline is selected
                  if (newDiscipline) {
                    setShowTopicsList(true);
                  } else {
                    setShowTopicsList(false);
                  }
                }}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border appearance-none cursor-pointer transition-all',
                  'bg-white text-gray-900 text-sm font-medium',
                  'hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  selectedDiscipline
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-300'
                )}
              >
                <option value="">Todas as Matérias</option>
                {disciplines.map((discipline) => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Placeholder para manter layout */}
          <div />
        </div>

        {/* Assuntos - Dropdown com checkboxes múltiplos */}
        {selectedDiscipline && showTopicsList && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Assuntos / Temas
            </h3>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar assunto..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <label
                    key={topic}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 line-clamp-2">
                      {topic}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nenhum assunto encontrado
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-200 pt-4 mt-4">
              <button
                onClick={() => {
                  onApplyFilters();
                  setShowTopicsList(false);
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                OK
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-2">
            {selectedDiscipline && (
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                <span>{selectedDiscipline}</span>
                <button
                  onClick={() => {
                    onDisciplineChange(null);
                    onTopicsChange([]);
                    setTopicSearch('');
                  }}
                  className="hover:text-emerald-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {selectedTopics.map((topic) => (
              <div
                key={topic}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span className="max-w-xs truncate">{topic}</span>
                <button
                  onClick={() => toggleTopic(topic)}
                  className="hover:text-blue-900 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


