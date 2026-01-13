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
  params: {
    slug: string;
  };
}

export default function CasePage({ params }: PageProps) {
  const caseItem = (caseData.cases as Case[]).find(
    (c) => c.slug === params.slug
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar para Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${levelInfo.color}`}>
                {levelInfo.text}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityColor}`}>
                {caseItem.priority === 'altissima' ? 'Altíssima' : 
                 caseItem.priority === 'alta' ? 'Alta' :
                 caseItem.priority === 'media' ? 'Média' : 'Baixa'} Prioridade
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Cabeçalho do Caso */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="font-medium">{caseData.discipline.name}</span>
            <span>•</span>
            <span>{caseData.module.name}</span>
            <span>•</span>
            <span>{caseItem.code}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {caseItem.title}
          </h1>
          
          <p className="text-lg text-gray-700 mb-6">
            {caseItem.topic}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Contexto: {caseItem.context}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Emenda: {caseItem.simpleEmenda}</span>
            </div>
          </div>
        </div>

        {/* Seções Principais */}
        <div className="space-y-8">
          {/* Narrativa */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Narrativa do Caso</h2>
                <p className="text-gray-600">História ilustrativa para fixação do conceito</p>
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {caseItem.narrativeMd}
              </ReactMarkdown>
            </div>
          </section>

          {/* Conflito */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Conflito Central</h2>
                <p className="text-gray-600">Problema jurídico a ser resolvido</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <p className="text-lg text-gray-800 leading-relaxed">
                {caseItem.conflict}
              </p>
            </div>
          </section>

          {/* Explicação */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Explicação Teórica</h2>
                <p className="text-gray-600">Fundamentos doutrinários e conceituais</p>
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {caseItem.explanationMd}
              </ReactMarkdown>
            </div>
          </section>

          {/* Aplicação */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Aplicação Prática</h2>
                <p className="text-gray-600">Como aplicar na resolução de casos reais</p>
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {caseItem.applicationMd}
              </ReactMarkdown>
            </div>
          </section>

          {/* Ideia Chave */}
          <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Ideia Chave para Memorizar</h3>
            <blockquote className="text-xl text-gray-800 italic border-l-4 border-emerald-500 pl-6 py-2">
              {caseItem.keyIdea}
            </blockquote>
          </section>

          {/* Dica para Prova */}
          <section className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Dica para Prova</h3>
            <p className="text-lg text-gray-800">{caseItem.proofTip}</p>
          </section>

          {/* Mnemônicos */}
          {caseItem.mnemonics.length > 0 && (
            <section className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Mnemônicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseItem.mnemonics.map((mnemonic, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="text-gray-800">{mnemonic}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Referências */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Referências</h3>
            <ul className="space-y-2">
              {caseItem.references.map((reference, index) => (
                <li key={index} className="text-gray-700">
                  • {reference}
                </li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Tags</h3>
            <div className="flex flex-wrap gap-2">
              {caseItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Botões de Memorização */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Sistema de Memorização
              </h3>
              <p className="text-gray-600">
                Avalie seu nível de compreensão deste caso
              </p>
            </div>
            <MemorizationButtons caseId={caseItem.code} />
          </section>
        </div>
      </main>
    </div>
  );
}