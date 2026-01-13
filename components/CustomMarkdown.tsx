'use client';

import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Lightbulb,
  Scale,
  AlertTriangle,
  Brain,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutType {
  type: 'dica' | 'lei' | 'perigo' | 'info' | 'mnemonico' | 'sucesso';
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
  titleColor: string;
}

const CALLOUT_TYPES: Record<string, CalloutType> = {
  dica: {
    type: 'dica',
    icon: <Lightbulb className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    titleColor: 'text-blue-800',
  },
  lei: {
    type: 'lei',
    icon: <Scale className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
    titleColor: 'text-emerald-800',
  },
  regra: {
    type: 'lei',
    icon: <Scale className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
    titleColor: 'text-emerald-800',
  },
  perigo: {
    type: 'perigo',
    icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-900',
    titleColor: 'text-red-800',
  },
  atencao: {
    type: 'perigo',
    icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-900',
    titleColor: 'text-red-800',
  },
  mnemonico: {
    type: 'mnemonico',
    icon: <Brain className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-900',
    titleColor: 'text-purple-800',
  },
  info: {
    type: 'info',
    icon: <Info className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-900',
    titleColor: 'text-cyan-800',
  },
  sucesso: {
    type: 'sucesso',
    icon: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-900',
    titleColor: 'text-green-800',
  },
};

// Detecta callout pattern: [!TIPO] conteúdo
function parseCallout(text: string): { type: string; content: string } | null {
  // Substitui quebras de linha por espaço para o match funcionar
  const normalizedText = text.replace(/\n/g, ' ').trim();
  const match = normalizedText.match(/^\[!(\w+)\]\s+(.+)$/);
  if (!match) return null;

  const typeKey = match[1].toLowerCase();
  if (!CALLOUT_TYPES[typeKey]) return null;

  return {
    type: typeKey,
    content: match[2],
  };
}

// Componente para renderizar blockquotes customizados
function Blockquote(props: {
  children?: React.ReactNode;
  node?: any;
  [key: string]: any;
}): React.ReactElement {
  const { children } = props;
  // Extrai o texto do blockquote
  let text = '';
  
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement;
      if (element.type === 'p' || element.type === 'div') {
        const props = element.props as { children?: React.ReactNode };
        return extractText(props.children);
      }
      const props = element.props as { children?: React.ReactNode };
      return extractText(props?.children ?? '');
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join('');
    }
    return '';
  };

  text = extractText(children);

  const callout = parseCallout(text);

  if (!callout) {
    // Renderiza blockquote padrão se não for callout
    return (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-700 my-4">
        {children}
      </blockquote>
    );
  }

  const config = CALLOUT_TYPES[callout.type];
  const titleLabels: Record<string, string> = {
    dica: '💡 Dica',
    lei: '⚖️ Lei/Regra',
    regra: '⚖️ Regra',
    perigo: '⚠️ Perigo',
    atencao: '⚠️ Atenção',
    mnemonico: '🧠 Mnemônico',
    info: 'ℹ️ Informação',
    sucesso: '✅ Sucesso',
  };

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 p-4 my-4',
        config.bgColor,
        config.borderColor,
      )}
    >
      <div className={cn('flex items-start gap-3')}>
        <div className={cn(config.textColor, 'flex-shrink-0 mt-0.5')}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-semibold text-sm mb-2',
              config.titleColor,
            )}
          >
            {titleLabels[callout.type] || callout.type.toUpperCase()}
          </h4>
          <div className={cn('text-sm leading-relaxed', config.textColor)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {callout.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes customizados para melhor tipografia
const customComponents: Components = {
  blockquote: Blockquote,
  
  // Melhorar tabelas
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children }) => (
    <thead className="bg-gray-100">
      {children}
    </thead>
  ),
  
  th: ({ children }) => (
    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
      {children}
    </th>
  ),
  
  td: ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-gray-700">
      {children}
    </td>
  ),
  
  // Melhorar headings
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3 scroll-mt-20">
      {children}
    </h1>
  ),
  
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3 scroll-mt-20">
      {children}
    </h2>
  ),
  
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2 scroll-mt-20">
      {children}
    </h3>
  ),
  
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-gray-900 mt-4 mb-2">
      {children}
    </h4>
  ),
  
  // Melhorar parágrafos
  p: ({ children }) => (
    <p className="text-base leading-relaxed text-gray-800 my-3">
      {children}
    </p>
  ),
  
  // Melhorar listas
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 my-4 text-gray-800">
      {children}
    </ul>
  ),
  
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 my-4 text-gray-800">
      {children}
    </ol>
  ),
  
  li: ({ children }) => (
    <li className="text-base leading-relaxed ml-2">
      {children}
    </li>
  ),
  
  // Melhorar código inline
  code: (props: any) => {
    const { children, inline, node } = props;
    if (inline) {
      return (
        <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return <code>{children}</code>;
  },
  
  // Melhorar código em bloco
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono">
      {children}
    </pre>
  ),
  
  // Melhorar links
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-emerald-600 hover:text-emerald-700 underline font-medium"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  
  // Melhorar separador horizontal
  hr: () => (
    <hr className="my-6 border-t-2 border-gray-300" />
  ),
  
  // Melhorar ênfase
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">
      {children}
    </strong>
  ),
  
  em: ({ children }) => (
    <em className="italic text-gray-800">
      {children}
    </em>
  ),
};

interface CustomMarkdownProps {
  content: string;
  className?: string;
}

export default function CustomMarkdown({
  content,
  className,
}: CustomMarkdownProps): React.ReactElement {
  return (
    <div className={cn('prose prose-sm sm:prose-base max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
