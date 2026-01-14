'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, BookOpen, Zap } from 'lucide-react';
import { Case } from '@/types/case';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  cases: Case[];
  onStatusFilterClick?: (status: 'dominado' | 'revisao' | 'pendente') => void;
}

interface Stats {
  total: number;
  dominado: number;
  revisao: number;
  pendente: number;
}

export default function DashboardStats({
  cases,
  onStatusFilterClick,
}: DashboardStatsProps) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    dominado: 0,
    revisao: 0,
    pendente: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const recalculateStats = () => {
    const newStats: Stats = {
      total: cases.length,
      dominado: 0,
      revisao: 0,
      pendente: 0,
    };

    // Lê ratings do novo formato (jurisfix-ratings)
    const savedRatings = localStorage.getItem('jurisfix-ratings');
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};

    cases.forEach((caseItem) => {
      const progress = ratings[caseItem.slug] ?? null;

      if (progress === null) {
        newStats.pendente += 1;
      } else if (progress >= 4) {
        newStats.dominado += 1;
      } else if (progress >= 1) {
        newStats.revisao += 1;
      }
    });

    setStats(newStats);
  };

  useEffect(() => {
    // Simular carregamento de 500ms
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    recalculateStats();
    setMounted(true);

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      recalculateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearTimeout(loadingTimer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [cases]);

  if (!mounted) {
    return null;
  }

  // Skeleton Loading Component
  const SkeletonStats = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
      {/* Título Skeleton */}
      <div className="mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Barra de Progresso Skeleton */}
      <div className="mb-6">
        <div className="h-4 rounded-full bg-gray-200 animate-pulse mb-4" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            {/* Icon + Title */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse" />
                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="h-6 w-12 bg-gray-300 rounded-full animate-pulse" />
            </div>

            {/* Number Skeleton */}
            <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mb-2" />

            {/* Text Skeleton */}
            <div className="h-3 w-32 bg-gray-300 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="mt-6 p-3 bg-gray-100 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
            <div className="h-3 w-48 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <SkeletonStats />;
  }

  const dominadoPercentage = (stats.dominado / stats.total) * 100 || 0;
  const revisaoPercentage = (stats.revisao / stats.total) * 100 || 0;
  const pendentePercentage = (stats.pendente / stats.total) * 100 || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
      {/* Título e Resumo Geral */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Seu Progresso
        </h2>
        <p className="text-sm text-gray-600">
          {stats.dominado}/{stats.total} casos dominados
        </p>
      </div>

      {/* Barra de Progresso Segmentada */}
      <div className="mb-6">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-100 mb-4 gap-0">
          {/* Segmento Dominado */}
          {stats.dominado > 0 && (
            <div
              className="bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${dominadoPercentage}%` }}
              title={`Dominado: ${stats.dominado}`}
            />
          )}

          {/* Segmento Em Revisão */}
          {stats.revisao > 0 && (
            <div
              className="bg-yellow-400 transition-all duration-500 ease-out"
              style={{ width: `${revisaoPercentage}%` }}
              title={`Em Revisão: ${stats.revisao}`}
            />
          )}

          {/* Segmento Pendente */}
          {stats.pendente > 0 && (
            <div
              className="bg-gray-300 transition-all duration-500 ease-out"
              style={{ width: `${pendentePercentage}%` }}
              title={`Pendente: ${stats.pendente}`}
            />
          )}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card Dominado */}
        <button
          onClick={() => onStatusFilterClick?.('dominado')}
          className={cn(
            'group relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-200',
            'hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer',
            'text-left'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-emerald-900">Dominado</h3>
            </div>
            {stats.dominado > 0 && (
              <div className="text-xs font-medium text-emerald-700 bg-white px-2 py-1 rounded-full">
                {dominadoPercentage.toFixed(0)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-emerald-600 mb-1">
            {stats.dominado}
          </p>
          <p className="text-xs text-emerald-700">
            {stats.dominado === 1 ? 'caso' : 'casos'} (nota 4-5)
          </p>
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-emerald-400" />
        </button>

        {/* Card Em Revisão */}
        <button
          onClick={() => onStatusFilterClick?.('revisao')}
          className={cn(
            'group relative bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200',
            'hover:border-yellow-400 hover:shadow-md transition-all duration-200 cursor-pointer',
            'text-left'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-yellow-900">Em Revisão</h3>
            </div>
            {stats.revisao > 0 && (
              <div className="text-xs font-medium text-yellow-700 bg-white px-2 py-1 rounded-full">
                {revisaoPercentage.toFixed(0)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-yellow-600 mb-1">
            {stats.revisao}
          </p>
          <p className="text-xs text-yellow-700">
            {stats.revisao === 1 ? 'caso' : 'casos'} (nota 1-3)
          </p>
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-yellow-400" />
        </button>

        {/* Card Pendente */}
        <button
          onClick={() => onStatusFilterClick?.('pendente')}
          className={cn(
            'group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200',
            'hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer',
            'text-left'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Novo</h3>
            </div>
            {stats.pendente > 0 && (
              <div className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-full">
                {pendentePercentage.toFixed(0)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-1">
            {stats.pendente}
          </p>
          <p className="text-xs text-blue-700">
            {stats.pendente === 1 ? 'caso' : 'caso'} sem nota
          </p>
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-blue-400" />
        </button>
      </div>

      {/* Footer com dica */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Clique nos cards</span> para filtrar casos por status
          </p>
        </div>
      </div>
    </div>
  );
}
