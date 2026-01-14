'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  caseId: string;
}

const FeedbackButtons = ({ caseId }: FeedbackButtonsProps) => {
  const { saveProgress, mounted } = useProgress(caseId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackOptions = [
    {
      id: 'nao',
      label: 'Ainda não',
      note: 1,
      status: 'revisar',
      icon: X,
      color: 'coral',
      toastMessage: 'Sem problemas! Você revisará este caso em breve.',
    },
    {
      id: 'duvidas',
      label: 'Com dúvidas',
      note: 3,
      status: 'revisar',
      icon: AlertCircle,
      color: 'amber',
      toastMessage: 'Ótimo! Você marcará este caso para revisão focada.',
    },
    {
      id: 'dominei',
      label: 'Dominei',
      note: 5,
      status: 'dominado',
      icon: CheckCircle2,
      color: 'emerald',
      toastMessage: 'Parabéns! Você dominou este caso! 🎉',
    },
  ];

  const getButtonStyles = (color: string) => {
    const colorMap: Record<string, { 
      border: string; 
      text: string;
      icon: string;
      hover: string;
      darkBorder: string;
      darkText: string;
      darkIcon: string;
      darkHover: string;
    }> = {
      coral: {
        border: 'border border-red-500',
        text: 'text-red-700',
        icon: 'text-red-600',
        hover: 'hover:bg-red-50',
        darkBorder: 'dark:border-red-600',
        darkText: 'dark:text-red-400',
        darkIcon: 'dark:text-red-500',
        darkHover: 'dark:hover:bg-red-950/30',
      },
      amber: {
        border: 'border border-amber-500',
        text: 'text-amber-700',
        icon: 'text-amber-600',
        hover: 'hover:bg-amber-50',
        darkBorder: 'dark:border-amber-600',
        darkText: 'dark:text-amber-400',
        darkIcon: 'dark:text-amber-500',
        darkHover: 'dark:hover:bg-amber-950/30',
      },
      emerald: {
        border: 'border border-emerald-500',
        text: 'text-emerald-700',
        icon: 'text-emerald-600',
        hover: 'hover:bg-emerald-50',
        darkBorder: 'dark:border-emerald-600',
        darkText: 'dark:text-emerald-400',
        darkIcon: 'dark:text-emerald-500',
        darkHover: 'dark:hover:bg-emerald-950/30',
      },
    };
    return colorMap[color] || colorMap.emerald;
  };

  const handleFeedback = async (option: typeof feedbackOptions[0]) => {
    setIsSubmitting(true);

    saveProgress(option.note);

    toast.success(option.label, {
      description: option.toastMessage,
      duration: 2000,
    });

    setIsSubmitting(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Título elegante e compacto */}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
        Como foi sua compreensão?
      </h3>

      {/* Botões compactos em grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {feedbackOptions.map((option) => {
          const Icon = option.icon;
          const styles = getButtonStyles(option.color);

          return (
            <button
              key={option.id}
              onClick={() => handleFeedback(option)}
              disabled={isSubmitting}
              className={cn(
                'flex flex-col items-center gap-2',
                'px-4 py-3 sm:py-4',
                'rounded-lg',
                'font-medium text-sm',
                'transition-all duration-200 ease-out',
                'hover:shadow-sm',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'bg-white',
                styles.border,
                styles.text,
                styles.hover,
                styles.darkBorder,
                styles.darkText,
                styles.darkHover
              )}
            >
              {/* Ícone compacto */}
              <Icon className={cn(
                'w-6 h-6',
                styles.icon
              )} />
              
              {/* Apenas label, sem descrição */}
              <span className="text-xs sm:text-sm font-medium">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackButtons;
