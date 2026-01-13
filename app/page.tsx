import Link from 'next/link';
import { ArrowRight, BookOpen, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            JurisFix
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Acessar Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6">
          {/* Título Principal */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
            <span className="block mb-2">Domine o Direito</span>
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Através de Casos Reais
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 leading-relaxed">
            A ponte entre a teoria doutrinária e a prática jurídica. Aprenda com uma curadoria técnica e visual de alto nível.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2"
            >
              Acessar Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-900 font-bold text-lg rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-300">
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-20 sm:mt-32 relative h-80 sm:h-96 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <BookOpen className="w-16 h-16 text-emerald-600 mx-auto" />
              <p className="text-gray-600 font-semibold">Preparando sua excelência jurídica</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Por que escolher JurisFix?
          </h2>
          <p className="text-xl text-gray-600">
            Três pilares que transformam seu aprendizado jurídico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-emerald-400 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <BookOpen className="w-7 h-7 text-emerald-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Estudo Visual
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Callouts pedagógicos e formatação Markdown Premium. Cada conceito apresentado de forma clara e memorável.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-blue-400 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <TrendingUp className="w-7 h-7 text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Progresso Gamificado
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Acompanhe seu domínio sobre cada tema jurídico. Sistema de ratings (0-5) com mnemônicos e dicas para prova.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-purple-400 transition-all duration-300">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Zap className="w-7 h-7 text-purple-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Busca Inteligente
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Encontre jurisprudência e tópicos em milissegundos. Filtros dinâmicos por área, tópico e nível de dificuldade.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl p-12 sm:p-16 text-center text-white space-y-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Pronto para dominar o Direito Administrativo?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Junte-se a estudantes e advogados de elite que já transformaram seu aprendizado jurídico.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-colors"
          >
            Acessar Dashboard Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-600">
          <p className="mb-2">
            <span className="font-semibold">Desenvolvido para advogados e estudantes de elite.</span>
          </p>
          <p className="text-sm">
            © 2026 JurisFix. Transformando a forma como aprendemos direito.
          </p>
        </div>
      </footer>
    </div>
  );
}
