'use client';

import { useState, useEffect } from 'react';
import { Case } from '@/types/case';
import caseData from '@/data/cases.json';

export function useProgress(caseId: string) {
  const [progress, setProgress] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Encontrar o caso pelo código/ID para obter o slug
  const getSlugFromCode = (code: string): string | null => {
    const cases = caseData.cases as Case[];
    const foundCase = cases.find(c => c.code === code);
    return foundCase?.slug ?? null;
  };

  // Carregar do localStorage ao montar
  useEffect(() => {
    const slug = getSlugFromCode(caseId);
    if (slug) {
      // Tenta ler de jurisfix-ratings (novo padrão)
      const saved = localStorage.getItem('jurisfix-ratings');
      if (saved) {
        try {
          const ratings = JSON.parse(saved);
          if (ratings[slug] !== undefined) {
            setProgress(ratings[slug]);
            setMounted(true);
            return;
          }
        } catch (error) {
          console.warn('Erro ao parsear jurisfix-ratings:', error);
        }
      }
    }

    // Fallback: tenta ler de case-progress-{caseId} (formato antigo)
    const savedOld = localStorage.getItem(`case-progress-${caseId}`);
    if (savedOld) {
      const progressValue = parseInt(savedOld, 10);
      setProgress(progressValue);
      
      // Migra para novo formato se encontrou no antigo
      if (slug && !Number.isNaN(progressValue)) {
        const saved = localStorage.getItem('jurisfix-ratings');
        const ratings = saved ? JSON.parse(saved) : {};
        ratings[slug] = progressValue;
        localStorage.setItem('jurisfix-ratings', JSON.stringify(ratings));
      }
    }
    
    setMounted(true);
  }, [caseId]);

  // Salvar no localStorage quando mudar
  const saveProgress = (score: number) => {
    setProgress(score);
    const slug = getSlugFromCode(caseId);
    
    if (slug) {
      // Salva no formato novo (principal)
      const saved = localStorage.getItem('jurisfix-ratings');
      const ratings = saved ? JSON.parse(saved) : {};
      ratings[slug] = score;
      localStorage.setItem('jurisfix-ratings', JSON.stringify(ratings));
    }
    
    // Mantém compatibilidade com formato antigo por enquanto
    localStorage.setItem(`case-progress-${caseId}`, score.toString());
  };

  return {
    progress: mounted ? progress : null,
    saveProgress,
    mounted,
  };
}
