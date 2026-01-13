import { Case } from '@/types/case';
import caseData from '@/data/cases.json';

export function getCaseIndex(slug: string): number {
  const cases = caseData.cases as Case[];
  return cases.findIndex((c) => c.slug === slug);
}

export function getCaseByIndex(index: number): Case | null {
  const cases = caseData.cases as Case[];
  return cases[index] || null;
}

export function getPreviousCase(slug: string): Case | null {
  const currentIndex = getCaseIndex(slug);
  if (currentIndex <= 0) return null;
  return getCaseByIndex(currentIndex - 1);
}

export function getNextCase(slug: string): Case | null {
  const cases = caseData.cases as Case[];
  const currentIndex = getCaseIndex(slug);
  if (currentIndex < 0 || currentIndex >= cases.length - 1) return null;
  return getCaseByIndex(currentIndex + 1);
}
