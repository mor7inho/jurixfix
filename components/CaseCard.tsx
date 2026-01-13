'use client';

import React from 'react';
import { ChevronRight, Clock, Tag, Award } from 'lucide-react';
import { Case } from '@/types/case';
import { cn, getPriorityColor, getLevelText } from '@/lib/utils';
import Link from 'next/link';

interface CaseCardProps {
  caseData: Case;
}

const CaseCard = ({ caseData }: CaseCardProps) => {
  const priorityColor = getPriorityColor(caseData.priority);
  const levelInfo = getLevelText(caseData.level);

  return (
    <Link href={`/case/${caseData.slug}`}>
      <div className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {caseData.code}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-emerald-700">
              {caseData.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {caseData.topic}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-3">
            {caseData.conflict}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn(
            "text-xs font-medium px-3 py-1 rounded-full border",
            levelInfo.color
          )}>
            {levelInfo.text}
          </span>
          <span className={cn(
            "text-xs font-medium px-3 py-1 rounded-full border",
            priorityColor
          )}>
            {caseData.priority === 'altissima' ? 'Altíssima' : 
             caseData.priority === 'alta' ? 'Alta' :
             caseData.priority === 'media' ? 'Média' : 'Baixa'} Prioridade
          </span>
          {caseData.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {caseData.tags.length > 2 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{caseData.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{caseData.createdAt}</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1 min-w-0 sm:flex-1">
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span className="truncate text-xs">{caseData.context}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <Award className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium truncate text-xs">Emenda: {caseData.simpleEmenda}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CaseCard;