'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Case } from '@/types/case';
import { cn } from '@/lib/utils';

interface CaseNavigationProps {
  slug: string;
  previousCase: Case | null;
  nextCase: Case | null;
}

export default function CaseNavigation({
  previousCase,
  nextCase,
}: CaseNavigationProps) {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-16 sm:mt-20 pt-6 sm:pt-8 border-t border-gray-200">
      {/* Caso Anterior */}
      {previousCase ? (
        <Link href={`/case/${previousCase.slug}`} className="group">
          <button
            className={cn(
              'w-full flex flex-col items-start gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg',
              'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300',
              'text-gray-900 font-medium',
              'transition-all duration-200 hover:shadow-sm group-hover:translate-x-[-4px]'
            )}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <ChevronLeft className="w-4 h-4" />
              <span>Caso Anterior</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
              {previousCase.title}
            </div>
            <div className="text-xs text-gray-500">
              {previousCase.code}
            </div>
          </button>
        </Link>
      ) : (
        <div
          className={cn(
            'w-full flex flex-col items-start gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg',
            'bg-gray-50 border border-gray-200',
            'text-gray-400 font-medium cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span>Caso Anterior</span>
          </div>
          <div className="text-xs sm:text-sm">Nenhum caso anterior</div>
        </div>
      )}

      {/* Próximo Caso */}
      {nextCase ? (
        <Link href={`/case/${nextCase.slug}`} className="group">
          <button
            className={cn(
              'w-full flex flex-col items-end gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg',
              'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300',
              'text-gray-900 font-medium',
              'transition-all duration-200 hover:shadow-sm group-hover:translate-x-[4px]'
            )}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span>Próximo Caso</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 text-right">
              {nextCase.title}
            </div>
            <div className="text-xs text-gray-500">
              {nextCase.code}
            </div>
          </button>
        </Link>
      ) : (
        <div
          className={cn(
            'w-full flex flex-col items-end gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg',
            'bg-gray-50 border border-gray-200',
            'text-gray-400 font-medium cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span>Próximo Caso</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-right">Nenhum próximo caso</div>
        </div>
      )}
    </nav>
  );
}
