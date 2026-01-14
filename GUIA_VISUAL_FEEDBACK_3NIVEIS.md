# 📊 Guia Visual - Sistema de Feedback 3 Níveis

## Interface Antes vs Depois

### ANTES: Sistema 0-5 Complexo
```
┌─────────────────────────────────────────────────────────┐
│        Sistema de Memorização (Título grande)            │
│              (com ícone Brain em destaque)               │
│   "Avalie seu nível de compreensão e o sistema          │
│    calculará quando revisar"                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ 0    │ │ 1    │ │ 2    │ │ 3    │ │ 4    │ │ 5    │ │
│  │Não   │ │Muito │ │Confuso│ │Entendi│ │Entendi│ │Dominei│
│  │entendi│ │confuso│       │ │básico │ │ bem  │ │totalmte│
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│                                                          │
│           ┌───────────────────────────┐                │
│           │    Confirmar Progresso    │                │
│           └───────────────────────────┘                │
│                                                          │
│  [Estilo: Grid 6 colunas, cores arco-íris, sombras]   │
│  [Carga Cognitiva: ALTA]                              │
└─────────────────────────────────────────────────────────┘
```

### DEPOIS: Sistema 3 Níveis Limpo
```
┌────────────────────────────────────┐
│  Como foi sua compreensão?         │
│  (text-sm font-medium)             │
├────────────────────────────────────┤
│                                    │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐
│  │ ✕ Ainda  │ │ ? Com     │ │ ✓ Dominei │
│  │   não    │ │   dúvidas │ │           │
│  └───────────┘ └───────────┘ └───────────┘
│
│  [Layout: Flex 3 colunas, responsivo]
│  [Cores: Vermelho | Âmbar | Verde]
│  [Carga Cognitiva: BAIXA ✓]
│
│  Dark Mode: Cores automáticas ajustadas
│  └────────────────────────────────────┘
```

---

## 🎨 Especificações de Cores

### Botão "Ainda não" (Red)
```
Light Mode:
  Fundo: bg-red-100
  Texto: text-red-700
  Hover: hover:bg-red-200
  Borda: border border-red-200
  Sombra: shadow-sm hover:shadow-md

Dark Mode:
  Fundo: dark:bg-red-900/30
  Texto: dark:text-red-400
  Hover: dark:hover:bg-red-900/40
  Borda: dark:border-red-800/30
```

### Botão "Com dúvidas" (Amber)
```
Light Mode:
  Fundo: bg-amber-100
  Texto: text-amber-700
  Hover: hover:bg-amber-200
  Borda: border border-amber-200
  Sombra: shadow-sm hover:shadow-md

Dark Mode:
  Fundo: dark:bg-amber-900/30
  Texto: dark:text-amber-400
  Hover: dark:hover:bg-amber-900/40
  Borda: dark:border-amber-800/30
```

### Botão "Dominei" (Emerald/Green)
```
Light Mode:
  Fundo: bg-emerald-100
  Texto: text-emerald-700
  Hover: hover:bg-emerald-200
  Borda: border border-emerald-200
  Sombra: shadow-sm hover:shadow-md

Dark Mode:
  Fundo: dark:bg-emerald-900/30
  Texto: dark:text-emerald-400
  Hover: dark:hover:bg-emerald-900/40
  Borda: dark:border-emerald-800/30
```

---

## 📱 Responsividade

### Desktop (sm: breakpoint)
```
┌─────────────────────────────────────┐
│  Como foi sua compreensão?          │
├─────────────────────────────────────┤
│                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ │ ✕ Ainda  │ │ ? Com    │ │ ✓ Dominei│
│ │   não    │ │  dúvidas │ │          │
│ └──────────┘ └──────────┘ └──────────┘
│   gap-4 px-6 py-4 (espaçamento maior)
└─────────────────────────────────────┘
```

### Mobile
```
┌──────────────────┐
│Como foi sua      │
│compreensão?      │
├──────────────────┤
│                  │
│ ┌──────────────┐ │
│ │ ✕ Ainda não │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │ ? Com        │ │
│ │   dúvidas    │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │ ✓ Dominei    │ │
│ └──────────────┘ │
│   gap-3 px-4 py-3
└──────────────────┘
```

---

## ⚡ Fluxo de Interação

```
Usuário abre caso
         ↓
Lê Narrativa, Explicação, Aplicação
         ↓
Vê título: "Como foi sua compreensão?"
         ↓
Clica em um dos 3 botões (exemplo: "Dominei")
         ↓
Component:
  1. Salva nota 5 no localStorage (jurisfix-ratings)
  2. Mostra toast: "Dominei - Parabéns! Você dominou este caso! 🎉"
  3. Aguarda 1 segundo
  4. Redireciona para /dashboard
         ↓
Dashboard atualiza:
  Status do caso: "dominado"
  Mostra na lista com badge verde
  Remove de "em-revisão"
```

---

## 🔀 Mapeamento de Notas

| Clique | Nota | Status | Dashboard | Cor |
|--------|------|--------|-----------|-----|
| Ainda não | 1 | revisar | Âmbar | 🔴 Red |
| Com dúvidas | 3 | revisar | Âmbar | 🟠 Amber |
| Dominei | 5 | dominado | Verde | 🟢 Green |

---

## 📝 Animações & Transições

```css
/* Todos os botões */
transition-all duration-200 ease-out

/* Ao passar mouse */
hover:scale-105 (cresce 5%)
hover:shadow-md (sombra mais forte)

/* Ao clicar */
active:scale-95 (encolhe 5%)

/* Quando desabilitado (durante envio) */
disabled:opacity-60
disabled:cursor-not-allowed
```

---

## 🌙 Exemplo de Dark Mode

Light:
```
┌─────────────────────────────────┐
│ Como foi sua compreensão?       │
├─────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐│
│ │✕ Ainda │ │? Com   │ │✓Dominei││
│ │  não   │ │dúvidas │ │        ││
│ └────────┘ └────────┘ └────────┘│
│ Red-100  Amber-100  Emerald-100 │
└─────────────────────────────────┘
```

Dark:
```
┌─────────────────────────────────┐ (fundo escuro)
│ Como foi sua compreensão?       │ (text-slate-300)
├─────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐│
│ │✕ Ainda │ │? Com   │ │✓Dominei││
│ │  não   │ │dúvidas │ │        ││
│ └────────┘ └────────┘ └────────┘│
│Red-900/30 Amber-900/30 Emerald-900/30
│Text: Red-400 Amber-400 Emerald-400
└─────────────────────────────────┘
```

