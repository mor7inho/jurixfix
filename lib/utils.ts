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

export function getCategoryColor(category?: string) {
  switch (category?.toLowerCase()) {
    // Principais áreas jurídicas com cores distintas
    case 'administrativo':
      return { name: 'Administrativo', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'constitucional':
      return { name: 'Constitucional', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'penal':
      return { name: 'Penal', color: 'bg-red-100 text-red-800 border-red-200' };
    case 'civil':
      return { name: 'Civil', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'trabalhista':
      return { name: 'Trabalhista', color: 'bg-green-100 text-green-800 border-green-200' };
    case 'processual':
      return { name: 'Processual', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
    case 'comercial':
      return { name: 'Comercial', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'empresarial':
      return { name: 'Empresarial', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'ambiental':
      return { name: 'Ambiental', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'internacional':
      return { name: 'Internacional', color: 'bg-sky-100 text-sky-800 border-sky-200' };
    case 'tributário':
      return { name: 'Tributário', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'consumidor':
      return { name: 'Consumidor', color: 'bg-pink-100 text-pink-800 border-pink-200' };
    case 'previdenciário':
      return { name: 'Previdenciário', color: 'bg-teal-100 text-teal-800 border-teal-200' };
    case 'imobiliário':
      return { name: 'Imobiliário', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'agrário':
      return { name: 'Agrário', color: 'bg-lime-100 text-lime-800 border-lime-200' };
    case 'eleitoral':
      return { name: 'Eleitoral', color: 'bg-violet-100 text-violet-800 border-violet-200' };
    case 'militar':
      return { name: 'Militar', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    case 'marítimo':
      return { name: 'Marítimo', color: 'bg-blue-50 text-blue-700 border-blue-100' };
    case 'aeronáutico':
      return { name: 'Aeronáutico', color: 'bg-blue-200 text-blue-900 border-blue-300' };
    default:
      return { name: category || 'Sem categoria', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
}
