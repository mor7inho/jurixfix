'use client';

import { useState, useMemo } from 'react';
import CaseCard from '@/components/CaseCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import caseData from '@/data/cases.json';
import { Case } from '@/types/case';

export default function DashboardPage() {
  const cases = caseData.cases as Case[];
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedDiscipline, setAppliedDiscipline] = useState<string | null>(null);
  const [appliedTopics, setAppliedTopics] = useState<string[]>([]);

  // Extract unique disciplines
  const disciplines = useMemo(() => {
    const uniqueDisciplines = new Set<string>();
    cases.forEach((caseItem) => {
      uniqueDisciplines.add(caseData.discipline.name);
    });
    return Array.from(uniqueDisciplines).sort();
  }, []);

  // Get topics for selected discipline
  const topics = useMemo(() => {
    if (!selectedDiscipline) return [];
    const uniqueTopics = new Set<string>();
    cases.forEach((caseItem) => {
      uniqueTopics.add(caseItem.topic);
    });
    return Array.from(uniqueTopics).sort();
  }, [selectedDiscipline]);

  // Filter cases based on discipline, topics, and search term
  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      // Filter by discipline
      if (appliedDiscipline && caseData.discipline.name !== appliedDiscipline) {
        return false;
      }

      // Filter by topics
      if (appliedTopics.length > 0 && !appliedTopics.includes(caseItem.topic)) {
        return false;
      }

      // Filter by search term (searches in title, code, topic, tags)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          caseItem.title.toLowerCase().includes(searchLower) ||
          caseItem.code.toLowerCase().includes(searchLower) ||
          caseItem.topic.toLowerCase().includes(searchLower) ||
          caseItem.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    });
  }, [appliedDiscipline, appliedTopics, searchTerm]);

  const handleApplyFilters = () => {
    setAppliedDiscipline(selectedDiscipline);
    setAppliedTopics(selectedTopics);
  };

  const handleClearFilters = () => {
    setSelectedDiscipline(null);
    setSelectedTopics([]);
    setAppliedDiscipline(null);
    setAppliedTopics([]);
    setSearchTerm('');
  };

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Cabeçalho */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">Dashboard</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
              Gerencie e estude seus casos jurídicos
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0 bg-gray-50 px-2 sm:px-3 py-1 rounded-lg">
            <span>{filteredCases.length} casos</span>
          </div>
        </div>

        {/* Busca */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Disciplina e Módulo */}
      <div className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-emerald-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
              {caseData.discipline.name}
            </h2>
            <p className="text-emerald-700 font-medium mt-1 text-xs sm:text-sm break-words">
              {caseData.module.name}
            </p>
            <p className="text-gray-600 mt-2 text-xs sm:text-sm leading-relaxed max-w-xl">
              Explore os casos práticos que fundamentam o Direito Administrativo brasileiro.
              Cada caso inclui narrativa, conflito, explicação teórica e aplicação prática.
            </p>
          </div>
          <div className="flex-shrink-0 min-w-max">
            <div className="inline-flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">
                Atualizado hoje
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        disciplines={disciplines}
        topics={topics}
        selectedDiscipline={selectedDiscipline}
        selectedTopics={selectedTopics}
        onDisciplineChange={setSelectedDiscipline}
        onTopicsChange={setSelectedTopics}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Grid de Cards ou Mensagem Vazia */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center max-w-md">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Nenhum caso encontrado
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {appliedTopics.length > 0
                ? 'Nenhum caso encontrado para esses assuntos.'
                : appliedDiscipline
                ? 'Nenhum caso encontrado para essa matéria.'
                : searchTerm
                ? 'Nenhum caso encontrado com este termo de busca.'
                : 'Nenhum caso disponível no momento.'}
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors text-sm"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCases.map((caseItem) => (
            <CaseCard key={caseItem.code} caseData={caseItem} />
          ))}
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Módulo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-gray-900">{cases.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Casos Totais</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-emerald-600">
              {cases.filter(c => c.priority === 'altissima').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Altíssima</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {cases.filter(c => c.level === 1).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Iniciante</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {cases.filter(c => c.tags.includes('regime-juridico')).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Regime</div>
          </div>
        </div>
      </div>
    </div>
  );
}