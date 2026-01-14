# 💻 Exemplos de Código - Feedback 3 Níveis

## 1. Usando o Componente

### Básico
```tsx
import FeedbackButtons from '@/components/FeedbackButtons';

export default function CasePage() {
  return (
    <section className="pt-4 sm:pt-6">
      <FeedbackButtons caseId="CASE001" />
    </section>
  );
}
```

### Com Contexto Completo (Página de Caso)
```tsx
import React from 'react';
import FeedbackButtons from '@/components/FeedbackButtons';
import CustomMarkdown from '@/components/CustomMarkdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  
  // ... carregar caso ...
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Seções do caso */}
      <section>
        <CustomMarkdown content={caseItem.narrativeMd} />
      </section>

      {/* Feedback no final */}
      <section className="pt-4 sm:pt-6">
        <FeedbackButtons caseId={caseItem.code} />
      </section>
    </main>
  );
}
```

---

## 2. Estrutura Interna do Componente

### Hook useProgress
```tsx
// Uso
const { progress, saveProgress, mounted } = useProgress(caseId);

// Salvar feedback
const handleFeedback = (note: number) => {
  saveProgress(note); // Salva em localStorage['jurisfix-ratings'][slug]
};
```

### LocalStorage
```ts
// Como é salvo
localStorage['jurisfix-ratings'] = JSON.stringify({
  "o-casamento-entre-o-direito-publico-e-o-direito-privado": 5,
  "os-superpoderes-da-administracao-com-coleira-juridica": 3,
});

// Como é recuperado
const ratings = JSON.parse(localStorage.getItem('jurisfix-ratings') || '{}');
const nota = ratings['o-casamento-entre-o-direito-publico-e-o-direito-privado']; // 5
```

---

## 3. Lógica de Mapeamento

### Da Nota para Status (useFilteredCases)
```ts
function getStatusFromRating(rating: number | null): FilterStatus {
  if (rating === null) return 'pendente';
  if (rating >= 4) return 'dominado';
  return 'em-revisao';
}

// Exemplos
getStatusFromRating(null);  // 'pendente'
getStatusFromRating(1);     // 'em-revisao' (Ainda não)
getStatusFromRating(3);     // 'em-revisao' (Com dúvidas)
getStatusFromRating(5);     // 'dominado'  (Dominei)
```

### No Dashboard (Filtragem)
```tsx
const { cases } = useFilteredCases({ 
  status: 'em-revisao' // Mostra casos com nota 1 ou 3
});

const { cases } = useFilteredCases({ 
  status: 'dominado' // Mostra casos com nota 5
});
```

---

## 4. Estilos Tailwind

### Botões - Light Mode
```jsx
// Red Button
<button className="
  bg-red-100 text-red-700
  hover:bg-red-200
  border border-red-200
  shadow-sm hover:shadow-md
">

// Amber Button
<button className="
  bg-amber-100 text-amber-700
  hover:bg-amber-200
  border border-amber-200
  shadow-sm hover:shadow-md
">

// Emerald Button
<button className="
  bg-emerald-100 text-emerald-700
  hover:bg-emerald-200
  border border-emerald-200
  shadow-sm hover:shadow-md
">
```

### Botões - Dark Mode
```jsx
// Red Button
<button className="
  dark:bg-red-900/30 dark:text-red-400
  dark:hover:bg-red-900/40
  dark:border dark:border-red-800/30
">

// Amber Button
<button className="
  dark:bg-amber-900/30 dark:text-amber-400
  dark:hover:bg-amber-900/40
  dark:border dark:border-amber-800/30
">

// Emerald Button
<button className="
  dark:bg-emerald-900/30 dark:text-emerald-400
  dark:hover:bg-emerald-900/40
  dark:border dark:border-emerald-800/30
">
```

### Layout Responsivo
```jsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full items-stretch">
  {/* flex-col no mobile, flex-row no sm: */}
  {/* gap-3 no mobile, gap-4 no sm: */}
  {/* items-stretch para ocupar altura igual */}
  
  <button className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg">
    {/* flex-1 para ocupar espaço igual */}
    {/* padding menor no mobile, maior no desktop */}
  </button>
</div>
```

---

## 5. Animações

### Transições
```jsx
<button className="
  transition-all duration-200 ease-out
  hover:scale-105 active:scale-95
  disabled:opacity-60 disabled:cursor-not-allowed
">
```

### Comportamento
```
Hover (mouse): 
  - Scale 105% (cresce 5%)
  - Shadow aumenta
  - Cor fica mais saturada

Click (ativo):
  - Scale 95% (encolhe 5%)
  - Feedback visual imediato

Disabled:
  - Opacity 60% (mais transparente)
  - Cursor muda para "not-allowed"
```

---

## 6. Toast Notifications

### Implementação
```tsx
import { toast } from 'sonner';

// No clique "Ainda não"
toast.success('Ainda não', {
  description: 'Sem problemas! Você revisará este caso em breve.',
  duration: 2000,
});

// No clique "Com dúvidas"
toast.success('Com dúvidas', {
  description: 'Ótimo! Você marcará este caso para revisão focada.',
  duration: 2000,
});

// No clique "Dominei"
toast.success('Dominei', {
  description: 'Parabéns! Você dominou este caso! 🎉',
  duration: 2000,
});
```

### Renderização
```
┌─────────────────────────────────────┐
│ ✓ Dominei                           │
├─────────────────────────────────────┤
│ Parabéns! Você dominou este caso! 🎉│
└─────────────────────────────────────┘
(desaparece após 2 segundos)
```

---

## 7. Fluxo de Redirecionamento

```ts
// 1. Salva progresso
saveProgress(5); // nota para o caso

// 2. Mostra toast
toast.success('Dominei', {
  description: 'Parabéns! Você dominou este caso! 🎉',
  duration: 2000,
});

// 3. Aguarda 1 segundo
setTimeout(() => {
  // 4. Redireciona
  router.push('/dashboard');
}, 1000);

// Timeline:
// 0ms:    Clique
// 0ms:    Salva + Toast
// 2000ms: Toast desaparece
// 1000ms: Redirecionamento (antes do toast desaparecer)
// ~2500ms: Usuário vê dashboard
```

---

## 8. Estados do Componente

```tsx
// Estado de submissão
const [isSubmitting, setIsSubmitting] = useState(false);

// Ao clicar
const handleFeedback = async (option) => {
  setIsSubmitting(true); // Desabilita botões
  
  saveProgress(option.note);
  toast.success(...);
  
  setTimeout(() => {
    router.push('/dashboard');
  }, 1000);
  
  // setIsSubmitting volta a false quando navigate
};

// Renderização
<button disabled={isSubmitting}>
  {/* Botão fica cinza e não clicável durante envio */}
</button>
```

---

## 9. Hidratação Segura

```tsx
const { progress, saveProgress, mounted } = useProgress(caseId);

// Renderizar apenas após hidratação
if (!mounted) {
  return null; // ou <Skeleton />
}

return (
  <div>
    {/* Componentes seguros de renderizar */}
  </div>
);
```

---

## 10. Ícones Lucide React

```tsx
import { CircleX, HelpCircle, CheckCircle2 } from 'lucide-react';

// Uso
<CircleX className="w-5 h-5 sm:w-6 sm:h-6" />
<HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />

// Sizes
sm (mobile):  w-5 h-5
sm: (desktop): w-6 h-6
```

---

## 11. Teste de Integração

```tsx
// Em um arquivo de teste
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackButtons from '@/components/FeedbackButtons';

describe('FeedbackButtons', () => {
  it('saves progress on click', async () => {
    render(<FeedbackButtons caseId="TEST001" />);
    
    const button = screen.getByRole('button', { name: /ainda não/i });
    await userEvent.click(button);
    
    // Verificar localStorage
    const ratings = JSON.parse(
      localStorage.getItem('jurisfix-ratings') || '{}'
    );
    expect(ratings['test-slug']).toBe(1);
  });

  it('shows toast notification', async () => {
    render(<FeedbackButtons caseId="TEST001" />);
    
    const button = screen.getByRole('button', { name: /dominei/i });
    await userEvent.click(button);
    
    // Verificar toast
    expect(screen.getByText(/parabéns/i)).toBeInTheDocument();
  });
});
```

---

## 12. Troubleshooting Comum

### Botões não salvam
```tsx
// Verificar se hook está sendo usado corretamente
const { saveProgress, mounted } = useProgress(caseId);

// Verificar localStorage manualmente
console.log(localStorage.getItem('jurisfix-ratings'));

// Verificar se caseId é válido
console.log(caseId); // ex: 'CASE001'
```

### Toast não aparece
```tsx
// Verificar se Toaster está no layout
import { Toaster } from 'sonner';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* Necessário! */}
      </body>
    </html>
  );
}
```

### Redirecionamento não funciona
```tsx
import { useRouter } from 'next/navigation';

// Verificar se está usando o router correto (não 'next/router')
const router = useRouter();

// Verificar se o caminho existe
router.push('/dashboard'); // ✓ Correto
// router.push('/dashbord'); // ✗ Erro
```

---

## 13. Referências Rápidas

### Cores
```
Red:     100, 200, 700, 800, 900/30
Amber:   100, 200, 700, 800, 900/30
Emerald: 100, 200, 700, 800, 900/30
```

### Breakpoints
```
mobile:  (default)
sm:      640px
md:      768px
lg:      1024px
xl:      1280px
```

### Espaçamento
```
Mobile:  px-4 py-3 gap-3
Desktop: px-6 py-4 gap-4 (sm: breakpoint)
```

### Ícones
```
CircleX:     Ainda não
HelpCircle:  Com dúvidas
CheckCircle2: Dominei
```

---

**Última atualização**: 13 de janeiro de 2026

