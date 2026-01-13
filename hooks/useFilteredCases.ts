'use client';

import { useMemo, useState, useEffect } from 'react';
import caseData from '@/data/cases.json';
import { Case } from '@/types/case';

export type FilterStatus = 'pendente' | 'em-revisao' | 'dominado';

export interface FilterOptions {
  search?: string;
  discipline?: string;
  status?: FilterStatus;
}

interface CaseWithRating extends Case {
  rating: number | null;
}

/**
 * Hook que filtra os casos baseado em search, discipline e status.
 * Lê as ratings do localStorage de forma segura (tratando hidratação).
 * 
 * Status mapping:
 * - "pendente": rating === null (nunca estudou)
 * - "em-revisao": rating === 0, 1, 2, 3 (precisa revisar)
 * - "dominado": rating === 4 ou 5
 */
export function useFilteredCases(filters: FilterOptions = {}) {
  const [mounted, setMounted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // Carregar ratings do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('jurisfix-ratings');
    if (saved) {
      try {
        setRatings(JSON.parse(saved));
      } catch (error) {
        console.warn('Erro ao parsear jurisfix-ratings:', error);
        setRatings({});
      }
    }
    setMounted(true);
  }, []);

  // Normalizar os casos com ratings
  const casesWithRatings = useMemo<CaseWithRating[]>(() => {
    return (caseData.cases as Case[]).map((c) => ({
      ...c,
      rating: ratings[c.slug] ?? null,
    }));
  }, [ratings]);

  // Aplicar filtros
  const filteredCases = useMemo<CaseWithRating[]>(() => {
    if (!mounted) {
      // Antes de montar, retorna todos sem considerar status
      return (caseData.cases as Case[]).map((c) => ({
        ...c,
        rating: null,
      }));
    }

    let result = [...casesWithRatings];

    // Filtro de search (título, topic, code)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    }

    // Filtro de discipline (comparar com module.slug ou disciplina)
    if (filters.discipline) {
      result = result.filter((c) => c.topic.toLowerCase().includes(filters.discipline!.toLowerCase()));
    }

    // Filtro de status (baseado em rating)
    if (filters.status) {
      result = result.filter((c) => {
        const status = getStatusFromRating(c.rating);
        return status === filters.status;
      });
    }

    return result;
  }, [casesWithRatings, filters, mounted]);

  return {
    cases: filteredCases,
    mounted,
    allCases: casesWithRatings,
  };
}

/**
 * Função auxiliar que mapeia rating para status
 */
function getStatusFromRating(rating: number | null): FilterStatus {
  if (rating === null) return 'pendente';
  if (rating >= 4) return 'dominado';
  return 'em-revisao';
}

/**
 * Função auxiliar para salvar rating no localStorage
 */
export function saveRating(caseSlug: string, rating: number): void {
  const current = localStorage.getItem('jurisfix-ratings');
  const ratings = current ? JSON.parse(current) : {};
  ratings[caseSlug] = rating;
  localStorage.setItem('jurisfix-ratings', JSON.stringify(ratings));
}

/**
 * Função auxiliar para obter rating de um caso
 */
export function getRating(caseSlug: string): number | null {
  const current = localStorage.getItem('jurisfix-ratings');
  if (!current) return null;
  const ratings = JSON.parse(current);
  return ratings[caseSlug] ?? null;
}
