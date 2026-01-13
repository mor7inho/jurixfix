'use client';

import { useState, useEffect } from 'react';

export function useProgress(caseId: string) {
  const [progress, setProgress] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Carregar do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem(`case-progress-${caseId}`);
    if (saved) {
      setProgress(parseInt(saved, 10));
    }
    setMounted(true);
  }, [caseId]);

  // Salvar no localStorage quando mudar
  const saveProgress = (score: number) => {
    setProgress(score);
    localStorage.setItem(`case-progress-${caseId}`, score.toString());
  };

  return {
    progress: mounted ? progress : null,
    saveProgress,
    mounted,
  };
}
