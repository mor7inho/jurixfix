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
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-12 pt-8 border-t border-gray-200">
      {/* Caso Anterior */}
      {previousCase ? (
        <Link href={`/case/${previousCase.slug}`} className="group">
          <button
            className={cn(
              'w-full flex flex-col items-start gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl',
              'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300',
              'text-gray-900 font-medium',
              'transition-all duration-200 hover:shadow-md group-hover:translate-x-[-4px]'
            )}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ChevronLeft className="w-4 h-4" />
              <span>Caso Anterior</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700">
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
            'w-full flex flex-col items-start gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl',
            'bg-gray-50 border border-gray-200',
            'text-gray-400 font-medium cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex items-center gap-2 text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span>Caso Anterior</span>
          </div>
          <div className="text-sm sm:text-base">Nenhum caso anterior</div>
        </div>
      )}

      {/* Próximo Caso */}
      {nextCase ? (
        <Link href={`/case/${nextCase.slug}`} className="group">
          <button
            className={cn(
              'w-full flex flex-col items-end gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl',
              'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300',
              'text-emerald-900 font-medium',
              'transition-all duration-200 hover:shadow-md group-hover:translate-x-[4px]'
            )}
          >
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <span>Próximo Caso</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-sm sm:text-base font-semibold text-emerald-900 line-clamp-2 group-hover:text-emerald-700 text-right">
              {nextCase.title}
            </div>
            <div className="text-xs text-emerald-600">
              {nextCase.code}
            </div>
          </button>
        </Link>
      ) : (
        <div
          className={cn(
            'w-full flex flex-col items-end gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl',
            'bg-gray-50 border border-gray-200',
            'text-gray-400 font-medium cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex items-center gap-2 text-sm">
            <span>Próximo Caso</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="text-sm sm:text-base text-right">Nenhum próximo caso</div>
        </div>
      )}
    </nav>
  );
}
