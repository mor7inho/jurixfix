'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import StatusFilterButtons from '@/components/StatusFilterButtons';
import ProgressBar from '@/components/ProgressBar';
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
          (caseItem.keyIdea && caseItem.keyIdea.toLowerCase().includes(searchLower)) ||
          (caseItem.tags && caseItem.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          ))
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
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
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
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* Cabeçalho + Busca */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {caseData.discipline.name} • {caseData.module.name}
          </p>
        </div>
        
        {/* Barra de Progresso Fina */}
        <ProgressBar />
        
        {/* Busca */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Filtros de Status */}
      <StatusFilterButtons
        selectedStatus={appliedStatus}
        onStatusChange={setAppliedStatus}
      />

      {/* Filtros - em linha única */}
      <div className="mb-6">
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
      </div>

      {/* Grid de Casos */}
      {/* Grid de Casos */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
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
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              {searchTerm
                ? 'Nenhum caso encontrado'
                : appliedStatus
                ? 'Nenhum caso neste status'
                : 'Nenhum caso disponível'}
            </h3>
            <p className="text-gray-600 mb-6 text-xs md:text-sm leading-relaxed">
              {searchTerm
                ? `Não encontramos casos para "${searchTerm}". Tente alterar sua busca.`
                : appliedStatus
                ? 'Nenhum caso com este status. Tente filtrar por outro.'
                : 'Nenhum caso disponível no momento.'}
            </p>
            {(searchTerm || appliedStatus) && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Indicador de Filtros Ativos */}
          {(searchTerm || appliedStatus) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              {searchTerm && (
                <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5">
                  <span className="text-xs text-teal-700">
                    Buscando: <span className="font-semibold">"{searchTerm}"</span>
                  </span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-teal-600 hover:text-teal-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {appliedStatus && (
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                  <span className="text-xs text-blue-700">
                    Status:{' '}
                    <span className="font-semibold">
                      {appliedStatus === 'dominado'
                        ? 'Dominado'
                        : appliedStatus === 'em-revisao'
                        ? 'Em Revisão'
                        : 'Novo'}
                    </span>
                  </span>
                  <button
                    onClick={() => setAppliedStatus(null)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grid 3 colunas responsivo com espaçamento generoso */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
            {filteredCases.map((caseItem) => (
              <CaseCard key={caseItem.code} caseData={caseItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
