# 🚀 Guia de Uso - Novo Sistema de Feedback 3 Níveis

## Para Desenvolvedores

### Usar o Componente

```tsx
import FeedbackButtons from '@/components/FeedbackButtons';

export default function CasePage() {
  const caseItem = { code: 'CASE001' };
  
  return (
    <section>
      <FeedbackButtons caseId={caseItem.code} />
    </section>
  );
}
```

### Props
```ts
interface FeedbackButtonsProps {
  caseId: string; // Código do caso (ex: 'CASE001')
}
```

### O que o Componente Faz

1. **Renderiza 3 botões** com ícones e labels
2. **Salva a nota** no localStorage (jurisfix-ratings)
3. **Exibe um toast** confirmando o feedback
4. **Redireciona** para o dashboard após 1 segundo

---

## Para Usuários

### Passo a Passo

1. **Leia o caso** inteiro (Narrativa, Explicação, Aplicação, etc)

2. **Veja a pergunta** no final:
   > "Como foi sua compreensão?"

3. **Escolha uma das 3 opções**:
   - 🔴 **Ainda não** - Se não entendeu direito
   - 🟠 **Com dúvidas** - Se tem incertezas
   - 🟢 **Dominei** - Se entendeu completamente

4. **Aguarde a confirmação**:
   - Um toast aparecerá na tela
   - Você será redirecionado para o dashboard automaticamente
   - Seu progresso foi salvo!

---

## Sistema de Status na Dashboard

Após avaliar, o caso aparecerá na dashboard com:

| Seu Clique | Status | Ícone | Cor |
|-----------|--------|-------|-----|
| Ainda não | 🔄 Revisar | ⚠️ | Âmbar |
| Com dúvidas | 🔄 Revisar | ❓ | Âmbar |
| Dominei | ✅ Dominado | ✓ | Verde |

---

## Recuperando Seu Progresso

Seus cliques são salvos no navegador. Se você:

- ✅ Abrir a mesma página depois → Vê o progresso anterior
- ✅ Ir para dashboard → Casos aparecem com o status correto
- ❌ Limpar cookies/cache → Progresso é perdido

---

## Perguntas Frequentes

### P: Posso mudar minha avaliação?
**R:** Sim! Abra o caso novamente e clique em outro botão. O novo valor sobrescreve o anterior.

### P: O sistema revisa automaticamente?
**R:** Não. Este é apenas o feedback imediato. O sistema de revisão spaced repetition será implementado depois.

### P: Posso clicar em "Ainda não" e depois em "Dominei"?
**R:** Sim! Cada clique atualiza seu progresso. Use-o para ser honesto com seu aprendizado.

### P: Onde meu progresso é salvo?
**R:** No armazenamento local do navegador (`localStorage`). Não há sincronização com nuvem (por enquanto).

### P: E se eu fechar a aba sem clicar?
**R:** Seu progresso anterior permanece. Nada muda até você clicar em um botão.

---

## Tecnologia Por Trás

### Armazenamento
```json
localStorage['jurisfix-ratings'] = {
  "o-casamento-entre-o-direito-publico-e-o-direito-privado": 5,
  "os-superpoderes-da-administracao-com-coleira-juridica": 3,
  "limpe-o-detetive-constitucional": 1
}
```

### Fluxo Técnico
```
Clique em botão
    ↓
FeedbackButtons.handleFeedback()
    ↓
useProgress.saveProgress(note)
    ↓
localStorage['jurisfix-ratings'][slug] = note
    ↓
toast.success() exibe mensagem
    ↓
router.push('/dashboard') após 1s
    ↓
Dashboard renderiza com status atualizado
```

### Compatibilidade
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Android Chrome)
- ✅ Tema Escuro (dark mode)
- ✅ Sem JavaScript alternativo

---

## Troubleshooting

### Botões não respondem
- Verifique se JavaScript está habilitado
- Tente recarregar a página
- Limpe o cache do navegador

### Toast não aparece
- Verifique notificações do navegador
- A mensagem sai da tela após 2 segundos

### Não é redirecionado para dashboard
- Verifique sua conexão de internet
- O progresso foi salvo mesmo assim
- Acesse `/dashboard` manualmente

### Tema escuro com cores erradas
- Sistema detecta preferência de tema do SO
- Verifique configurações de tema do navegador
- Recarregue a página se necessário

---

## Roadmap Futuro

- [ ] Adicionar tempo de revisão recomendado
- [ ] Sistema de spaced repetition automático
- [ ] Sincronização com backend (opcional)
- [ ] Análise de progresso mais detalhada
- [ ] Exportar dados de aprendizado

