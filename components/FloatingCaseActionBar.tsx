'use client';

import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Eye, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface FloatingCaseActionBarProps {
  caseTitle: string;
  caseSlug: string;
}

type RatingType = 'dominado' | 'revisao' | 'pendente';

export default function FloatingCaseActionBar({
  caseTitle,
  caseSlug,
}: FloatingCaseActionBarProps) {
  const [mounted, setMounted] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);

  // Carregar rating do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('jurisfix-ratings');
    if (saved) {
      try {
        const ratings = JSON.parse(saved);
        setCurrentRating(ratings[caseSlug] ?? null);
      } catch (error) {
        console.warn('Erro ao carregar rating:', error);
      }
    }
    setMounted(true);
  }, [caseSlug]);

  const handleRating = (rating: number, label: string) => {
    // Atualizar localStorage
    const saved = localStorage.getItem('jurisfix-ratings');
    const ratings = saved ? JSON.parse(saved) : {};
    ratings[caseSlug] = rating;
    localStorage.setItem('jurisfix-ratings', JSON.stringify(ratings));

    // Atualizar estado
    setCurrentRating(rating);

    // Mostrar toast
    toast.success(`${label} - Salvo com sucesso!`, {
      duration: 2000,
      position: 'top-center',
    });
  };

  if (!mounted) return null;

  const ratingButtons = [
    {
      rating: 5,
      label: 'Dominado',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      textColor: 'text-emerald-600',
      icon: Check,
      shortLabel: 'Dominado',
    },
    {
      rating: 2,
      label: 'Revisar',
      color: 'bg-yellow-400 hover:bg-yellow-500',
      textColor: 'text-yellow-600',
      icon: AlertCircle,
      shortLabel: 'Revisar',
    },
    {
      rating: 0,
      label: 'Ainda não li',
      color: 'bg-gray-400 hover:bg-gray-500',
      textColor: 'text-gray-600',
      icon: Eye,
      shortLabel: 'Não li',
    },
  ];

  // Desktop: Barra lateral discreta à direita
  const DesktopBar = () => (
    <div className="hidden lg:fixed right-0 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-white rounded-l-2xl shadow-lg border-l border-gray-200 p-4 space-y-2">
        {/* Título truncado verticalmente */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-700 text-center max-w-[60px] line-clamp-2 leading-tight">
            {caseTitle}
          </p>
        </div>

        {/* Botões */}
        {ratingButtons.map(({ rating, label, color, icon: Icon }) => (
          <button
            key={rating}
            onClick={() => handleRating(rating, label)}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${color} text-white shadow-md hover:shadow-lg ${
              currentRating === rating ? 'ring-2 ring-offset-2 ring-gray-400' : ''
            }`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile: Barra flutuante no rodapé
  const MobileBar = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Backdrop subtle */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />

      <div className="relative bg-white border-t border-gray-200 px-4 py-3 shadow-xl">
        {/* Título do caso */}
        <div className="mb-3 pb-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900 text-center leading-tight">
            {caseTitle}
          </p>
        </div>

        {/* Grid de botões 3 colunas */}
        <div className="grid grid-cols-3 gap-2">
          {ratingButtons.map(({ rating, label, color, icon: Icon, shortLabel }) => (
            <button
              key={rating}
              onClick={() => handleRating(rating, label)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${color} text-white shadow-md hover:shadow-lg ${
                currentRating === rating ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
              title={label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium text-center leading-tight">
                {shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopBar />
      <MobileBar />
    </>
  );
}
