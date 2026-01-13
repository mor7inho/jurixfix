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
    <div className="flex gap-4 mt-12 pt-8 border-t border-gray-200">
      {/* Caso Anterior */}
      {previousCase ? (
        <Link href={`/case/${previousCase.slug}`}>
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium',
              'transition-all duration-200 hover:shadow-md'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Caso Anterior</span>
            <span className="sm:hidden">Anterior</span>
          </button>
        </Link>
      ) : (
        <div
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
            'bg-gray-100 text-gray-400 font-medium cursor-not-allowed opacity-50'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Caso Anterior</span>
          <span className="sm:hidden">Anterior</span>
        </div>
      )}

      {/* Próximo Caso */}
      {nextCase ? (
        <Link href={`/case/${nextCase.slug}`}>
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'bg-emerald-500 hover:bg-emerald-600 text-white font-medium',
              'transition-all duration-200 hover:shadow-md'
            )}
          >
            <span className="hidden sm:inline">Próximo Caso</span>
            <span className="sm:hidden">Próximo</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </Link>
      ) : (
        <div
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
            'bg-gray-100 text-gray-400 font-medium cursor-not-allowed opacity-50'
          )}
        >
          <span className="hidden sm:inline">Próximo Caso</span>
          <span className="sm:hidden">Próximo</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
