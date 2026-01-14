# 🔧 DETALHES TÉCNICOS DA MIGRAÇÃO

## Mapeamento JSON → Schema Prisma

### Campo: Origin (decomposição)

**JSON Original:**
```json
"origin": {
  "source": "Material Base - Regime Jurídico Administrativo",
  "concurso": "Concursos Gerais",
  "year": 2024
}
```

**Prisma Mapping:**
```typescript
originSource: "Material Base - Regime Jurídico Administrativo"    // origin.source
originConcurso: "Concursos Gerais"                              // origin.concurso
originYear: 2024                                                 // origin.year
```

---

## Mapeamento JSON → Schema Prisma

### Campo: SRS (decomposição)

**JSON Original:**
```json
"srs": {
  "memoryWeight": 5,
  "initialIntervalDays": 1
}
```

**Prisma Mapping:**
```typescript
srsWeight: 5.0                    // srs.memoryWeight (convertido para Float)
srsInterval: 1                    // srs.initialIntervalDays
```

---

## Novos Campos Adicionados ao Schema

### 1. **axis** (String?)
- **Tipo**: String opcional
- **Função**: Classificação temática do caso
- **Exemplos**: "Princípios", "Atos Administrativos", "Organização Administrativa"
- **JSON Source**: `caseData.axis`

### 2. **subtopics** (String[])
- **Tipo**: Array de strings
- **Função**: Divisões temáticas menores dentro do tópico
- **Exemplos**: `["prerrogativas", "sujeições", "supremacia do interesse público"]`
- **JSON Source**: `caseData.subtopics`

### 3. **conceptCore** (String?)
- **Tipo**: String opcional
- **Função**: Conceito central/essencial do caso para memorização
- **Exemplos**: "Regime público = prerrogativas + sujeições"
- **JSON Source**: `caseData.conceptCore`

### 4. **prerequisites** (String[])
- **Tipo**: Array de strings
- **Função**: Tópicos que devem ser estudados antes deste caso
- **Exemplos**: `["Regime Jurídico de Direito Público"]`
- **JSON Source**: `caseData.prerequisites`

### 5. **nextTopics** (String[])
- **Tipo**: Array de strings
- **Função**: Tópicos recomendados para estudo após este caso
- **Exemplos**: `["Princípio da Legalidade", "Princípio da Supremacia do Interesse Público"]`
- **JSON Source**: `caseData.nextTopics`

### 6. **appearsInEditais** (String[])
- **Tipo**: Array de strings
- **Função**: Editais/concursos onde este caso aparece (relevância)
- **Exemplos**: `["TCE", "TRT", "PF", "PRF"]`
- **JSON Source**: `caseData.appearsInEditais`

### 7. **srsWeight** (Float, default: 1.0)
- **Tipo**: Float
- **Função**: Peso no algoritmo de repetição espaçada (0.5 = menos urgente, 5.0 = muito urgente)
- **JSON Source**: `caseData.srs.memoryWeight`

### 8. **srsInterval** (Int, default: 1)
- **Tipo**: Integer
- **Função**: Intervalo inicial em dias para primeira revisão
- **JSON Source**: `caseData.srs.initialIntervalDays`

### 9. **originSource** (String, default: "Geral")
- **Tipo**: String com default
- **Função**: Fonte/origem do material do caso
- **Valores Tipicos**: "Geral", "Apostila", "Prova", "Material Base"
- **JSON Source**: `caseData.origin.source`

### 10. **originConcurso** (String?)
- **Tipo**: String opcional
- **Função**: Concurso ou edital específico de origem
- **Exemplos**: "PF 2025", "TJ 2024", "OAB", "TCE", "Concursos Gerais"
- **JSON Source**: `caseData.origin.concurso`

### 11. **originYear** (Int?)
- **Tipo**: Integer opcional
- **Função**: Ano de publicação/edição do material
- **JSON Source**: `caseData.origin.year`

---

## Schema Prisma Completo (After Migration)

```prisma
model Case {
  id              String   @id @default(cuid())
  code            String   @unique
  slug            String   @unique
  
  // Classificação temática
  axis            String?
  topic           String
  subtopics       String[]
  conceptCore     String?
  
  // Origem/Fonte do Caso
  originSource    String   @default("Geral")
  originConcurso  String?
  originYear      Int?
  
  // Conteúdo estruturado (Markdown)
  narrativeMd     String   @db.Text
  conflict        String   @db.Text
  explanationMd   String   @db.Text
  applicationMd   String   @db.Text
  keyIdea         String?
  proofTip        String?
  
  // Contexto e metadados
  context         String?
  level           Int      @default(1)
  priority        String   @default("media")
  
  // Emenda simplificada
  simpleEmenda    String   @db.Text
  
  // Pré-requisitos e próximos tópicos
  prerequisites   String[]
  nextTopics      String[]
  appearsInEditais String[]
  
  // SRS (Spaced Repetition System)
  srsWeight       Float    @default(1.0)
  srsInterval     Int      @default(1)
  
  // Status e publicação
  isPublished     Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relações
  mnemonics       Mnemonic[]
  references      Reference[]
  tags            CaseTag[]
  studentProgress StudentProgress[] @relation("StudentProgress")
  statistics      CaseStatistics? @relation("CaseStatistics")
}
```

---

## Seed Script (seed.ts) - Lógica Principal

```typescript
// Mapeamento de origem
const originSource = caseData.origin?.source || 'Geral';
const originConcurso = caseData.origin?.concurso || null;
const originYear = caseData.origin?.year || null;

// Mapeamento de SRS
const srsWeight = caseData.srs?.memoryWeight || 1.0;
const srsInterval = caseData.srs?.initialIntervalDays || 1;

// Usar upsert para garantir idempotência
const result = await prisma.case.upsert({
  where: { code: caseData.code },
  update: { /* atualiza se existe */ },
  create: { /* cria se não existe */ }
});
```

---

## Migrações Executadas

### Migration 1: `20260113230537_reinit_db`
- **Ação**: Reset completo do banco
- **Resultado**: Schema limpo, pronto para novo modelo

### Migration 2: `20260113231727_remove_title`
- **Ação**: Adiciona novos campos
- **Status**: ✅ Executada

### Migration 3: `20260113234430_remove_title_from_case`
- **Ação**: Remove campo `title` (usando `code` + `slug`)
- **Status**: ✅ Executada

---

## Validação de Dados

Após o seed, todos os 10 casos foram validados:

```
✅ DA-M01-C001 → 10 campos de metadados + 5 mnemonics
✅ DA-M01-C002 → 10 campos de metadados + 5 tags
✅ DA-M01-C003 → 10 campos de metadados + 1 mnemonic
✅ DA-M01-C004 → 10 campos de metadados + 0 mnemonics
✅ DA-M01-C005 → 10 campos de metadados + 0 mnemonics
✅ DA-M01-C006 → 10 campos de metadados + 0 mnemonics
✅ DA-M01-C007 → 10 campos de metadados + 0 mnemonics
✅ DA-M01-C008 → 10 campos de metadados + 0 mnemonics
✅ DA-M01-C009 → 10 campos de metadados + 0 mnemonics
✅ DA-M01-C010 → 10 campos de metadados + 0 mnemonics

📊 TOTAL: 10/10 casos ✅
```

---

## Padrão de Fallback

O seed script usa safe defaults para campos opcionais:

```typescript
// Fallback para campos de origem
originSource: caseData.origin?.source || 'Geral'
originConcurso: caseData.origin?.concurso || null
originYear: caseData.origin?.year || null

// Fallback para SRS
srsWeight: caseData.srs?.memoryWeight || 1.0
srsInterval: caseData.srs?.initialIntervalDays || 1

// Fallback para arrays
subtopics: caseData.subtopics || []
prerequisites: caseData.prerequisites || []
nextTopics: caseData.nextTopics || []
appearsInEditais: caseData.appearsInEditais || []
```

---

## Performance

- **Tempo de seed**: ~2-3 segundos para 10 casos
- **Conexão**: PostgreSQL via Supabase
- **Transações**: Cada case é um upsert atômico
- **Índices**: `code` (unique), `slug` (unique) para queries rápidas

---

## Compatibilidade

✅ **Backward Compatible**: 
- Campos antigos (narrativeMd, conflict, etc.) mantêm mesma estrutura
- Existing APIs/hooks continuam funcionando
- Dashboard pode usar novos campos opcionalmente

✅ **Frontend Ready**:
- Novos filtros podem usar `axis`, `appearsInEditais`
- SRS pode usar `srsWeight` e `srsInterval`
- Learning paths podem usar `prerequisites` e `nextTopics`
