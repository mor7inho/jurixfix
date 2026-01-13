import CaseCard from '@/components/CaseCard';
import SearchBar from '@/components/SearchBar';
import caseData from '@/data/cases.json';
import { Case } from '@/types/case';

export default function DashboardPage() {
  const cases = caseData.cases as Case[];

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Gerencie e estude seus casos jurídicos de forma eficiente
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {cases.length} casos disponíveis
            </span>
          </div>
        </div>

        {/* Filtros e Busca */}
        <SearchBar />
      </div>

      {/* Disciplina e Módulo */}
      <div className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {caseData.discipline.name}
            </h2>
            <p className="text-emerald-700 font-medium mt-1">
              {caseData.module.name}
            </p>
            <p className="text-gray-600 mt-2 max-w-3xl">
              Explore os casos práticos que fundamentam o Direito Administrativo brasileiro.
              Cada caso inclui narrativa, conflito, explicação teórica e aplicação prática.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-emerald-200">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">
                Atualizado hoje
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem.code} caseData={caseItem} />
        ))}
      </div>

      {/* Estatísticas */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{cases.length}</div>
            <div className="text-sm text-gray-600">Casos Totais</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-emerald-600">
              {cases.filter(c => c.priority === 'altissima').length}
            </div>
            <div className="text-sm text-gray-600">Prioridade Altíssima</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {cases.filter(c => c.level === 1).length}
            </div>
            <div className="text-sm text-gray-600">Nível Iniciante</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {cases.filter(c => c.tags.includes('regime-juridico')).length}
            </div>
            <div className="text-sm text-gray-600">Casos de Regime</div>
          </div>
        </div>
      </div>
    </div>
  );
}