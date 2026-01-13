'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Brain, Check } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

interface MemorizationButtonsProps {
  caseId: string;
}

const MemorizationButtons = ({ caseId }: MemorizationButtonsProps) => {
  const { progress, saveProgress, mounted } = useProgress(caseId);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scores = [
    { value: 0, label: 'Não entendi', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
    { value: 1, label: 'Muito confuso', color: 'bg-red-100 hover:bg-red-200 text-red-800' },
    { value: 2, label: 'Confuso', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
    { value: 3, label: 'Entendi o básico', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
    { value: 4, label: 'Entendi bem', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' },
    { value: 5, label: 'Dominei totalmente', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  ];

  const handleScoreClick = (score: number) => {
    setSelectedScore(score);
  };

  const handleSubmit = () => {
    if (selectedScore !== null) {
      saveProgress(selectedScore);
      setIsSubmitted(true);
      
      // Determinar mensagem dinâmica baseada na nota
      const scoreMessages = {
        0: { title: 'Não entendi', desc: 'Estude novamente em breve' },
        1: { title: 'Muito confuso', desc: 'Revisão urgente necessária' },
        2: { title: 'Confuso', desc: 'Revise os conceitos principais' },
        3: { title: 'Entendi o básico', desc: 'Pratique mais aplicações' },
        4: { title: 'Entendi bem', desc: 'Ótimo progresso, continue assim!' },
        5: { title: 'Dominei totalmente', desc: 'Parabéns, você dominou este tópico!' }
      };
      
      const message = scoreMessages[selectedScore as keyof typeof scoreMessages];
      
      // Mostrar toast de sucesso com mensagem dinâmica
      toast.success(`${message.title} - Nota ${selectedScore}/5`, {
        description: message.desc,
        icon: selectedScore >= 4 ? '🎉' : '📝',
        duration: 3000,
      });
      
      // Reset após 2 segundos
      setTimeout(() => {
        setSelectedScore(null);
        setIsSubmitted(false);
      }, 2000);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Grid de Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {scores.map((score) => (
          <button
            key={score.value}
            onClick={() => handleScoreClick(score.value)}
            className={cn(
              "flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200",
              "hover:scale-105 active:scale-95 hover:-translate-y-1",
              selectedScore === score.value
                ? "border-emerald-500 shadow-lg scale-105 ring-2 ring-emerald-200"
                : progress === score.value
                ? "border-emerald-400 shadow-md"
                : "border-gray-200 hover:border-gray-300",
              score.color
            )}
            disabled={isSubmitted}
            aria-label={`Avaliar como ${score.value} - ${score.label}`}
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{score.value}</div>
            <div className="text-xs sm:text-sm font-medium line-clamp-2 text-center leading-tight">
              {score.label}
            </div>
            {progress === score.value && (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 absolute mt-12 sm:mt-14 text-emerald-600 font-bold" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
        <button
          onClick={handleSubmit}
          disabled={selectedScore === null || isSubmitted}
          className={cn(
            "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3",
            selectedScore !== null && !isSubmitted
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
          aria-label="Confirmar avaliação"
        >
          {isSubmitted ? (
            <>
              <Check className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-semibold">Avaliação Registrada!</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-semibold">Confirmar Avaliação</span>
            </>
          )}
        </button>

        {/* Mensagens de Feedback */}
        {isSubmitted && (
          <div className="text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <Check className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-emerald-700 font-semibold text-sm sm:text-base">
                  Avaliação salva com sucesso!
                </p>
                <p className="text-xs sm:text-sm text-emerald-600">
                  O sistema será otimizado para sua próxima revisão
                </p>
              </div>
            </div>
          </div>
        )}

        {!isSubmitted && selectedScore !== null && (
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-700">
              <span className="font-semibold text-emerald-600">Nota {selectedScore}:</span>{' '}
              {scores.find(s => s.value === selectedScore)?.label}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Clique em "Confirmar" para registrar sua avaliação
            </p>
          </div>
        )}

        {progress !== null && !isSubmitted && selectedScore === null && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm sm:text-base text-blue-700">
                <span className="font-semibold">Última avaliação:</span> {progress}/5
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600 text-center font-medium mb-3">
          Guia de Desempenho
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-3 h-3 bg-gray-300 rounded mt-0.5 flex-shrink-0"></div>
            <div className="text-xs sm:text-sm">
              <div className="font-medium text-gray-900">0-1: Revisar Urgente</div>
              <div className="text-gray-600">Conceito não consolidado</div>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="w-3 h-3 bg-yellow-300 rounded mt-0.5 flex-shrink-0"></div>
            <div className="text-xs sm:text-sm">
              <div className="font-medium text-gray-900">2-3: Revisar em Breve</div>
              <div className="text-gray-600">Conhecimento básico adquirido</div>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="w-3 h-3 bg-emerald-300 rounded mt-0.5 flex-shrink-0"></div>
            <div className="text-xs sm:text-sm">
              <div className="font-medium text-gray-900">4-5: Dominado</div>
              <div className="text-gray-600">Tópico bem consolidado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorizationButtons;