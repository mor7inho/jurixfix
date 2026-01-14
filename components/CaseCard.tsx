'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Case } from '@/types/case';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CaseCardProps {
  caseData: Case;
}

const CaseCard = ({ caseData }: CaseCardProps) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedRatings = localStorage.getItem('jurisfix-ratings');
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};
    
    const progressValue = ratings[caseData.slug] ?? null;
    setProgress(progressValue);
    setMounted(true);
  }, [caseData.slug]);

  if (!mounted) {
    return null;
  }

  // Cor da borda esquerda baseada no progresso
  const getBorderLeftColor = () => {
    if (progress === null) return 'border-l-slate-200';
    if (progress >= 4) return 'border-l-emerald-500';
    if (progress >= 1) return 'border-l-amber-500';
    return 'border-l-slate-200';
  };

  // Shadow dinâmica
  const getShadowClass = () => {
    if (progress === null) return 'shadow-sm hover:shadow-md';
    if (progress >= 4) return 'shadow-md hover:shadow-lg';
    if (progress >= 1) return 'shadow-sm hover:shadow-md';
    return 'shadow-sm hover:shadow-md';
  };

  // Extrai primeiras 2 tags (se disponíveis)
  const displayTags = caseData.tags?.slice(0, 2) || [];

  return (
    <Link href={`/case/${caseData.slug}`}>
      <div className={cn(
        "group bg-white rounded-lg border border-slate-200 border-l-4 p-6 transition-all duration-300 cursor-pointer flex flex-col h-full",
        getBorderLeftColor(),
        getShadowClass()
      )}>
        {/* Topo: Tag de Tópico Discreta */}
        <div className="mb-4">
          <span className="text-xs font-light tracking-widest text-slate-500 uppercase">
            {caseData.topic}
          </span>
        </div>

        {/* Centro: Título com Destaque Total */}
        <div className="flex items-start justify-between gap-3 mb-5 flex-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 line-clamp-3 transition-colors leading-tight">
            {caseData.title}
          </h3>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
        </div>

        {/* Base: 2 Tags em Formato Pílula Minimalista */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </Link>
  );
};

export default CaseCard;