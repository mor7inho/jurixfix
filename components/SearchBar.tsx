'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar = ({ value = '', onChange }: SearchBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  const searchTerm = value !== undefined ? value : localSearchTerm;
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalSearchTerm(newValue);
    }
  };

  return (
    <div className="flex-1 relative min-w-0">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar por título, tópico, código ou termos legais..."
        className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          title="Limpar busca"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;