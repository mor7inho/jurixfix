'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { label: 'Todos os níveis', value: 'all' },
    { label: 'Iniciante', value: '1' },
    { label: 'Intermediário', value: '2' },
    { label: 'Avançado', value: '3' },
  ];

  const priorities = [
    { label: 'Todas as prioridades', value: 'all' },
    { label: 'Altíssima', value: 'altissima' },
    { label: 'Alta', value: 'alta' },
    { label: 'Média', value: 'media' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar casos..."
            className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl flex items-center justify-center sm:justify-start gap-2 transition-colors flex-shrink-0 text-sm sm:text-base whitespace-nowrap",
            showFilters
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-medium">Filtros</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Nível</h4>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Prioridade</h4>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
              Limpar
            </button>
            <button className="px-4 sm:px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm sm:text-base">
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;