'use client';

import React, { useState } from 'react';
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {scores.map((score) => (
          <button
            key={score.value}
            onClick={() => handleScoreClick(score.value)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              selectedScore === score.value
                ? "border-emerald-500 shadow-lg transform scale-[1.02]"
                : progress === score.value
                ? "border-emerald-400 shadow-lg"
                : "border-gray-200 hover:border-gray-300",
              score.color
            )}
            disabled={isSubmitted}
          >
            <div className="text-2xl font-bold mb-2">{score.value}</div>
            <div className="text-sm font-medium">{score.label}</div>
            {progress === score.value && (
              <Check className="w-4 h-4 absolute mt-6 text-emerald-600" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <button
          onClick={handleSubmit}
          disabled={selectedScore === null || isSubmitted}
          className={cn(
            "px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 flex items-center gap-3",
            selectedScore !== null && !isSubmitted
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {isSubmitted ? (
            <>
              <Check className="w-6 h-6" />
              Avaliação Registrada!
            </>
          ) : (
            <>
              <Brain className="w-6 h-6" />
              Confirmar Avaliação
            </>
          )}
        </button>

        {isSubmitted && (
          <div className="text-center">
            <p className="text-emerald-600 font-medium">
              Sua avaliação foi salva no sistema de repetição espaçada.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              O caso será revisado no momento ideal para sua memorização.
            </p>
          </div>
        )}

        {!isSubmitted && selectedScore !== null && (
          <div className="text-center text-sm text-gray-600">
            <p>
              <span className="font-medium">Nota {selectedScore}:</span>{' '}
              {scores.find(s => s.value === selectedScore)?.label}
            </p>
            <p className="mt-1">
              Esta avaliação ajudará o sistema a programar suas revisões.
            </p>
          </div>
        )}

        {progress !== null && !isSubmitted && selectedScore === null && (
          <div className="text-center text-sm text-emerald-600">
            <p className="font-medium">Última avaliação: {progress}/5</p>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>0-1: Revisar urgentemente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>2-3: Revisar em breve</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-200 rounded"></div>
            <span>4-5: Domínio consolidado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorizationButtons;