import React from 'react';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import FeedbackButtons from '@/components/FeedbackButtons';
import CaseNavigation from '@/components/CaseNavigation';
import CustomMarkdown from '@/components/CustomMarkdown';
import { ArrowLeft, BookOpen, Target, Lightbulb, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Render case pages dynamically to avoid DB connection during build
export const dynamic = 'force-dynamic';

// ISR: Revalidar a cada 1 hora
export const revalidate = 3600;

// Páginas de alta prioridade são geradas no build
// Outras são geradas on-demand na primeira requisição
export const dynamicParams = true;

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  
  const caseItem = await prisma.case.findUnique({
    where: { slug },
    include: {
      mnemonics: true,
      references: true,
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!caseItem || !caseItem.isPublished) {
    notFound();
  }

  // Buscar casos anterior e próximo
  const allCases = await prisma.case.findMany({
    where: { isPublished: true },
    orderBy: [
      { priority: 'desc' },
      { level: 'asc' },
      { createdAt: 'asc' },
    ],
  });

  const currentIndex = allCases.findIndex((c) => c.slug === slug);
  const previousCaseData = currentIndex > 0 ? allCases[currentIndex - 1] : null;
  const nextCaseData = currentIndex >= 0 && currentIndex < allCases.length - 1 ? allCases[currentIndex + 1] : null;

  // Converter para formato esperado pelo CaseNavigation
  const previousCase = previousCaseData ? ({
    slug: previousCaseData.slug,
    code: previousCaseData.code,
    title: previousCaseData.title,
    topic: previousCaseData.topic,
    level: previousCaseData.level,
    priority: previousCaseData.priority as 'alta' | 'altissima' | 'media' | 'baixa',
    simpleEmenda: previousCaseData.simpleEmenda,
    narrativeMd: previousCaseData.narrativeMd,
    conflict: previousCaseData.conflict,
    explanationMd: previousCaseData.explanationMd,
    applicationMd: previousCaseData.applicationMd,
  } as any) : null;

  const nextCase = nextCaseData ? ({
    slug: nextCaseData.slug,
    code: nextCaseData.code,
    title: nextCaseData.title,
    topic: nextCaseData.topic,
    level: nextCaseData.level,
    priority: nextCaseData.priority as 'alta' | 'altissima' | 'media' | 'baixa',
    simpleEmenda: nextCaseData.simpleEmenda,
    narrativeMd: nextCaseData.narrativeMd,
    conflict: nextCaseData.conflict,
    explanationMd: nextCaseData.explanationMd,
    applicationMd: nextCaseData.applicationMd,
  } as any) : null;

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full pb-16 lg:pb-8">
        {/* Cabeçalho do Caso */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4">
            <span className="font-medium">Direito Administrativo</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{caseItem.topic}</span>
            <span className="hidden sm:inline">•</span>
            <span>{caseItem.code}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {caseItem.title}
          </h1>
          
          <p className="text-lg sm:text-lg text-gray-700 mb-6">
            {caseItem.topic}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1 min-w-0">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Contexto: {caseItem.context}</span>
            </div>
            <div className="hidden sm:inline">•</div>
            <div className="flex items-center gap-1 min-w-0">
              <Target className="w-4 h-4 flex-shrink-0" />
              <span className="break-words">Emenda: {caseItem.simpleEmenda}</span>
            </div>
          </div>
        </div>

        {/* Seções Principais */}
        <div className="space-y-5 sm:space-y-6">
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
            <CustomMarkdown content={caseItem.narrativeMd} className="overflow-hidden" />
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
            <CustomMarkdown content={caseItem.explanationMd} className="overflow-hidden" />
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
            <CustomMarkdown content={caseItem.applicationMd} className="overflow-hidden" />
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
          {caseItem.mnemonics && caseItem.mnemonics.length > 0 && (
            <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🧠 Mnemônicos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {caseItem.mnemonics.map((mnemonic, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200"
                  >
                    <div className="text-sm sm:text-base text-gray-800">{mnemonic.text}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Referências */}
          {caseItem.references && caseItem.references.length > 0 && (
            <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
              <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-3">📚 Referências</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {caseItem.references.map((reference, index) => (
                  <div key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <span className="font-medium">•</span> {reference.text}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {caseItem.tags && caseItem.tags.length > 0 && (
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-3">🏷️ Tags</h3>
            <div className="flex flex-wrap gap-2">
              {caseItem.tags.map((tagRel) => (
                <span
                  key={tagRel.tag.id}
                  className="px-2 sm:px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
                >
                  {tagRel.tag.name}
                </span>
              ))}
            </div>
          </section>
          )}

          {/* Feedback de Compreensão */}
          <section className="pt-2 sm:pt-4">
            <FeedbackButtons caseId={caseItem.code} />
          </section>

          {/* Navegação entre Casos */}
          <CaseNavigation 
            slug={slug}
            previousCase={previousCase}
            nextCase={nextCase}
          />
        </div>
      </main>
    </div>
  );
}
