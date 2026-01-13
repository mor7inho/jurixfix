import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'altissima':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'alta':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'baixa':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getLevelText(level: number) {
  switch (level) {
    case 1:
      return { text: 'Iniciante', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 2:
      return { text: 'Intermediário', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 3:
      return { text: 'Avançado', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    default:
      return { text: 'Iniciante', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
}