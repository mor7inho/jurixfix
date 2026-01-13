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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar casos por título, tópico ou código..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-4 py-3 border rounded-xl flex items-center gap-2 transition-colors",
            showFilters
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Nível</h4>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Prioridade</h4>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mr-3">
              Limpar
            </button>
            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;