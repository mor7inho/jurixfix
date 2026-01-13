'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook que previne o scroll automático para o topo quando filtrando
 * Mantém a posição do scroll do usuário intacta
 */
export function usePreventScrollOnFilter() {
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    // Salva a posição do scroll antes de qualquer re-render
    const handleBeforeUnload = () => {
      scrollPositionRef.current = window.scrollY;
    };

    // Previne scroll para topo ao mudar filtros
    const handleScroll = () => {
      // Se o usuário não está no topo e temos uma posição salva, mantém
      if (window.scrollY === 0 && scrollPositionRef.current > 0) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    // Função auxiliar para restaurar posição se necessário
    restoreScrollPosition: (position: number) => {
      window.scrollTo({ top: position, behavior: 'smooth' });
    },
  };
}
