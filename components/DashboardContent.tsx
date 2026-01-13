'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import StatusFilterButtons from '@/components/StatusFilterButtons';
import StudyStats from '@/components/StudyStats';
import StatisticsCards from '@/components/StatisticsCards';
import DashboardStats from '@/components/DashboardStats';
import { useFilteredCases, FilterStatus } from '@/hooks/useFilteredCases';
import caseData from '@/data/cases.json';
import { Case } from '@/types/case';

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cases = caseData.cases as Case[];
  const scrollPositionRef = useRef<number>(0);
  
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus | null>(null);
  const [selectedSort, setSelectedSort] = useState<'recentes' | 'avaliados'>('recentes');
  const [appliedDiscipline, setAppliedDiscipline] = useState<string | null>(null);
  const [appliedTopics, setAppliedTopics] = useState<string[]>([]);
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<FilterStatus | null>(null);
  const [appliedSort, setAppliedSort] = useState<'recentes' | 'avaliados'>('recentes');
  const [mounted, setMounted] = useState(false);

  // Load filters from URL on mount
  useEffect(() => {
    const disciplineParam = searchParams.get('discipline');
    const topicsParam = searchParams.get('topics');
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status') as FilterStatus | null;
    const sortParam = searchParams.get('sort') as 'recentes' | 'avaliados' | null;

    if (disciplineParam) {
      setSelectedDiscipline(disciplineParam);
      setAppliedDiscipline(disciplineParam);
    }

    if (topicsParam) {
      const topicsList = topicsParam.split(',').filter(Boolean);
      setSelectedTopics(topicsList);
      setAppliedTopics(topicsList);
    }

    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setAppliedCategory(categoryParam);
    }

    if (statusParam) {
      setSelectedStatus(statusParam);
      setAppliedStatus(statusParam);
    }

    if (sortParam) {
      setSelectedSort(sortParam);
      setAppliedSort(sortParam);
    }

    setMounted(true);
  }, [searchParams]);

  // Update URL when filters change (sem fazer scroll para topo)
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams();

    if (appliedDiscipline) {
      params.set('discipline', appliedDiscipline);
    }

    if (appliedTopics.length > 0) {
      params.set('topics', appliedTopics.join(','));
    }

    if (searchTerm) {
      params.set('search', encodeURIComponent(searchTerm));
    }

    if (appliedCategory) {
      params.set('category', appliedCategory);
    }

    if (appliedStatus) {
      params.set('status', appliedStatus);
    }

    if (appliedSort !== 'recentes') {
      params.set('sort', appliedSort);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/dashboard?${queryString}` : '/dashboard';
    router.push(newUrl, { scroll: false });
  }, [appliedDiscipline, appliedTopics, searchTerm, appliedCategory, appliedStatus, appliedSort, mounted, router]);

  // Limpar tópicos quando categoria muda (para não mostrar tópicos inválidos)
  useEffect(() => {
    if (selectedCategory !== appliedCategory) {
      // Categoria foi alterada - limpar tópicos selecionados
      setSelectedTopics([]);
      setAppliedTopics([]);
    }
  }, [selectedCategory]);

  // Rastrear posição do scroll ao usuário scrollar
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract unique disciplines
  const disciplines = useMemo(() => {
    const uniqueDisciplines = new Set<string>();
    cases.forEach((caseItem) => {
      uniqueDisciplines.add(caseData.discipline.name);
    });
    return Array.from(uniqueDisciplines).sort();
  }, []);

  // Get topics for selected discipline (and category if selected)
  const topics = useMemo(() => {
    const uniqueTopics = new Set<string>();
    cases.forEach((caseItem) => {
      // If a category is selected, only show topics from that category
      if (selectedCategory && caseItem.category !== selectedCategory) {
        return;
      }
      uniqueTopics.add(caseItem.topic);
    });
    return Array.from(uniqueTopics).sort();
  }, [selectedCategory]);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    cases.forEach((caseItem) => {
      if (caseItem.category) {
        uniqueCategories.add(caseItem.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, []);

  // Filter cases based on discipline, topics, category, and search term
  const filteredCases = useMemo(() => {
    let result = cases.filter((caseItem) => {
      // Filter by discipline
      if (appliedDiscipline && caseData.discipline.name !== appliedDiscipline) {
        return false;
      }

      // Filter by topics
      if (appliedTopics.length > 0 && !appliedTopics.includes(caseItem.topic)) {
        return false;
      }

      // Filter by category
      if (appliedCategory && caseItem.category !== appliedCategory) {
        return false;
      }

      // Filter by search term (searches in title, code, topic, tags, conflict, and explanation)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          caseItem.title.toLowerCase().includes(searchLower) ||
          caseItem.code.toLowerCase().includes(searchLower) ||
          caseItem.topic.toLowerCase().includes(searchLower) ||
          caseItem.conflict.toLowerCase().includes(searchLower) ||
          caseItem.explanationMd.toLowerCase().includes(searchLower) ||
          caseItem.keyIdea.toLowerCase().includes(searchLower) ||
          caseItem.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    });

    // Apply status filter if selected
    if (appliedStatus) {
      const ratings = (() => {
        if (typeof window === 'undefined') return {};
        const saved = localStorage.getItem('jurisfix-ratings');
        return saved ? JSON.parse(saved) : {};
      })();

      result = result.filter((caseItem) => {
        const rating = ratings[caseItem.slug] ?? null;
        if (appliedStatus === 'pendente') return rating === null;
        if (appliedStatus === 'em-revisao') return rating !== null && rating < 4;
        if (appliedStatus === 'dominado') return rating !== null && rating >= 4;
        return true;
      });
    }

    // Apply sorting
    if (appliedSort === 'avaliados') {
      const ratings = (() => {
        if (typeof window === 'undefined') return {};
        const saved = localStorage.getItem('jurisfix-ratings');
        return saved ? JSON.parse(saved) : {};
      })();

      result.sort((a, b) => {
        const ratingA = ratings[a.slug] ?? 0;
        const ratingB = ratings[b.slug] ?? 0;
        return ratingB - ratingA;
      });
    } else {
      // Sort by date (newer first)
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [appliedDiscipline, appliedTopics, appliedCategory, searchTerm, appliedStatus, appliedSort]);

  const handleApplyFilters = () => {
    setAppliedDiscipline(selectedDiscipline);
    setAppliedTopics(selectedTopics);
    setAppliedCategory(selectedCategory);
  };

  const handleClearFilters = () => {
    setSelectedDiscipline(null);
    setSelectedTopics([]);
    setAppliedDiscipline(null);
    setAppliedTopics([]);
    setSelectedCategory(null);
    setAppliedCategory(null);
    setAppliedStatus(null);
    setAppliedSort('recentes');
    setSelectedStatus(null);
    setSelectedSort('recentes');
    setSearchTerm('');
  };

  const handleStatusFilterClick = (status: 'dominado' | 'revisao' | 'pendente' | null) => {
    // Salvar posição ANTES de mudar o filtro
    scrollPositionRef.current = window.scrollY;

    let newStatus: FilterStatus | null = null;
    
    if (status === 'dominado') {
      newStatus = 'dominado';
    } else if (status === 'revisao') {
      newStatus = 'em-revisao';
    } else if (status === 'pendente') {
      newStatus = 'pendente';
    }
    
    setAppliedStatus(newStatus);
  };

  if (!mounted) {
    return null;
  }

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

      {/* Resumo de Progresso */}
      <DashboardStats onStatusFilterClick={handleStatusFilterClick} />

      {/* Filtros de Status - Rápido e Visível */}
      <StatusFilterButtons
        selectedStatus={appliedStatus}
        onStatusChange={setAppliedStatus}
      />

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

      {/* Estatísticas de Estudo */}
      <StudyStats cases={cases} />

      {/* Cards de Estatísticas Resumidas */}
      <StatisticsCards cases={cases} />

      {/* Filtros */}
      <FilterBar
        disciplines={disciplines}
        topics={topics}
        categories={categories}
        selectedDiscipline={selectedDiscipline}
        selectedTopics={selectedTopics}
        selectedCategory={selectedCategory}
        selectedStatus={appliedStatus}
        selectedSort={appliedSort}
        caseCount={filteredCases.length}
        onDisciplineChange={setSelectedDiscipline}
        onTopicsChange={setSelectedTopics}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setAppliedStatus}
        onSortChange={setAppliedSort}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Grid de Cards ou Mensagem Vazia */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="mb-6 flex justify-center">
              {searchTerm ? (
                <div className="text-6xl">🔍</div>
              ) : appliedStatus ? (
                <div className="text-6xl">📋</div>
              ) : (
                <div className="text-6xl">📚</div>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {searchTerm
                ? 'Nenhum caso encontrado'
                : appliedStatus
                ? 'Nenhum caso neste status'
                : 'Nenhum caso disponível'}
            </h3>
            <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
              {searchTerm
                ? `Não encontramos casos para "${searchTerm}". Tente buscar por:
                  - Título do caso
                  - Código (ex: DA-M01-C001)
                  - Tópico jurídico
                  - Termos da explicação
                  - Tags relacionadas`
                : appliedTopics.length > 0
                ? 'Nenhum caso encontrado para esses assuntos. Tente alterar os filtros.'
                : appliedStatus
                ? 'Nenhum caso com este status. Que tal revisar os pendentes?'
                : 'Nenhum caso disponível no momento.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors text-sm"
              >
                Limpar Filtros
              </button>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Indicador de Busca Ativa */}
          {(searchTerm || appliedStatus) && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              {searchTerm && (
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                  <span className="text-sm text-emerald-700">
                    <span className="font-semibold">Buscando:</span> "{searchTerm}"
                  </span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-emerald-600 hover:text-emerald-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {appliedStatus && (
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                  <span className="text-sm text-blue-700">
                    <span className="font-semibold">Status:</span>{' '}
                    {appliedStatus === 'dominado'
                      ? 'Dominado'
                      : appliedStatus === 'em-revisao'
                      ? 'Em Revisão'
                      : 'Pendente'}
                  </span>
                  <button
                    onClick={() => setAppliedStatus(null)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCases.map((caseItem) => (
              <CaseCard key={caseItem.code} caseData={caseItem} />
            ))}
          </div>
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
