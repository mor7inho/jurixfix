import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import caseData from '@/data/cases.json';
import { Case } from '@/types/case';
import MemorizationButtons from '@/components/MemorizationButtons';
import { ArrowLeft, BookOpen, Target, Lightbulb, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const caseItem = (caseData.cases as Case[]).find(
    (c) => c.slug === slug
  );

  if (!caseItem) {
    notFound();
  }

  const levelInfo = {
    1: { text: 'Iniciante', color: 'bg-blue-100 text-blue-800' },
    2: { text: 'Intermediário', color: 'bg-purple-100 text-purple-800' },
    3: { text: 'Avançado', color: 'bg-indigo-100 text-indigo-800' },
  }[caseItem.level];

  const priorityColor = {
    altissima: 'bg-red-100 text-red-800',
    alta: 'bg-orange-100 text-orange-800',
    media: 'bg-yellow-100 text-yellow-800',
    baixa: 'bg-green-100 text-green-800',
  }[caseItem.priority];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
              <span className="font-medium">Voltar</span>
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`text-xs font-medium px-2 sm:px-3 py-1 rounded-full ${levelInfo?.color || ''}`}>
                {levelInfo?.text || ''}
              </span>
              <span className={`text-xs font-medium px-2 sm:px-3 py-1 rounded-full ${priorityColor}`}>
                {caseItem.priority === 'altissima' ? 'Altíssima' : 
                 caseItem.priority === 'alta' ? 'Alta' :
                 caseItem.priority === 'media' ? 'Média' : 'Baixa'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        {/* Cabeçalho do Caso */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4">
            <span className="font-medium">{caseData.discipline.name}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{caseData.module.name}</span>
            <span className="hidden sm:inline">•</span>
            <span>{caseItem.code}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {caseItem.title}
          </h1>
          
          <p className="text-lg sm:text-lg text-gray-700 mb-6">
            {caseItem.topic}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Contexto: {caseItem.context}</span>
            </div>
            <div className="hidden sm:inline">•</div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Emenda: {caseItem.simpleEmenda}</span>
            </div>
          </div>
        </div>

        {/* Seções Principais */}
        <div className="space-y-6 sm:space-y-8">
          {/* Narrativa */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Narrativa do Caso</h2>
                <p className="text-xs sm:text-sm text-gray-600">História ilustrativa</p>
              </div>
            </div>
            <div className="prose prose-sm sm:prose-lg max-w-none overflow-hidden">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {caseItem.narrativeMd}
              </ReactMarkdown>
            </div>
          </section>

          {/* Conflito */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Conflito Central</h2>
                <p className="text-xs sm:text-sm text-gray-600">Problema jurídico</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                {caseItem.conflict}
              </p>
            </div>
          </section>

          {/* Explicação */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Explicação Teórica</h2>
                <p className="text-xs sm:text-sm text-gray-600">Fundamentos doutrinários</p>
              </div>
            </div>
            <div className="prose prose-sm sm:prose-lg max-w-none overflow-hidden">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {caseItem.explanationMd}
              </ReactMarkdown>
            </div>
          </section>

          {/* Aplicação */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Aplicação Prática</h2>
                <p className="text-xs sm:text-sm text-gray-600">Como aplicar</p>
              </div>
            </div>
            <div className="prose prose-sm sm:prose-lg max-w-none overflow-hidden">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {caseItem.applicationMd}
              </ReactMarkdown>
            </div>
          </section>

          {/* Ideia Chave */}
          <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-emerald-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">💡 Ideia Chave para Memorizar</h3>
            <blockquote className="text-base sm:text-xl text-gray-800 italic border-l-4 border-emerald-500 pl-4 py-2">
              {caseItem.keyIdea}
            </blockquote>
          </section>

          {/* Dica para Prova */}
          <section className="bg-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-yellow-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🎯 Dica para Prova</h3>
            <p className="text-base sm:text-lg text-gray-800">{caseItem.proofTip}</p>
          </section>

          {/* Mnemônicos */}
          {caseItem.mnemonics.length > 0 && (
            <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🧠 Mnemônicos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {caseItem.mnemonics.map((mnemonic, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200"
                  >
                    <div className="text-sm sm:text-base text-gray-800">{mnemonic}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Referências */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📚 Referências</h3>
            <ul className="space-y-2">
              {caseItem.references.map((reference, index) => (
                <li key={index} className="text-sm sm:text-base text-gray-700">
                  • {reference}
                </li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🏷️ Tags</h3>
            <div className="flex flex-wrap gap-2">
              {caseItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm border border-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Botões de Memorização */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Sistema de Memorização
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Avalie seu nível de compreensão
              </p>
            </div>
            <MemorizationButtons caseId={caseItem.code} />
          </section>
        </div>
      </main>
    </div>
  );
}