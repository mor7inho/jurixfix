#!/usr/bin/env node

/**
 * Script robusto para adicionar casos em lote
 * Suporta 50-100 casos/dia com validação e segurança
 * 
 * Uso: npm run add-cases:batch <arquivo.json>
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(`${color}${args.join(' ')}${colors.reset}`);
}

// Validar estrutura do caso
function validateCase(caseData, index) {
  const requiredFields = [
    'id', 'code', 'title', 'slug', 'axis', 'topic',
    'narrativeMd', 'conflict', 'explanationMd', 'applicationMd', 'simpleEmenda'
  ];

  const errors = [];

  // Campos obrigatórios
  for (const field of requiredFields) {
    if (!caseData[field] || (typeof caseData[field] === 'string' && !caseData[field].trim())) {
      errors.push(`Campo obrigatório "${field}" vazio`);
    }
  }

  // Validar tipos
  if (caseData.level && (typeof caseData.level !== 'number' || caseData.level < 1 || caseData.level > 4)) {
    errors.push(`"level" deve ser 1-4, recebido: ${caseData.level}`);
  }

  if (caseData.priority && !['altissima', 'alta', 'media', 'baixa'].includes(caseData.priority)) {
    errors.push(`"priority" inválida: ${caseData.priority}`);
  }

  // Validar slug (sem espaços, caracteres especiais)
  if (caseData.slug && !/^[a-z0-9-]+$/.test(caseData.slug)) {
    errors.push(`"slug" inválido: ${caseData.slug} (use apenas letras, números e hífen)`);
  }

  // Validar code (padrão: XX-XXX-CXXX)
  if (caseData.code && !/^[A-Z]{2}-[A-Z0-9]{2,4}-C\d{3,4}$/.test(caseData.code)) {
    errors.push(`"code" não segue padrão: ${caseData.code}`);
  }

  if (errors.length > 0) {
    throw new Error(`Caso ${index} (${caseData.code || 'SEM CODE'}):\n  - ${errors.join('\n  - ')}`);
  }

  return true;
}

// Normalizar dados do caso
function normalizeCase(caseData) {
  return {
    ...caseData,
    title: caseData.title?.trim(),
    slug: caseData.slug?.toLowerCase().trim(),
    code: caseData.code?.trim().toUpperCase(),
    axis: caseData.axis?.trim(),
    topic: caseData.topic?.trim(),
    narrativeMd: caseData.narrativeMd?.trim(),
    conflict: caseData.conflict?.trim(),
    explanationMd: caseData.explanationMd?.trim(),
    applicationMd: caseData.applicationMd?.trim(),
    simpleEmenda: caseData.simpleEmenda?.trim(),
    subtopics: (caseData.subtopics || []).map(s => s?.trim()).filter(Boolean),
    prerequisites: (caseData.prerequisites || []).map(p => p?.trim()).filter(Boolean),
    nextTopics: (caseData.nextTopics || []).map(t => t?.trim()).filter(Boolean),
    appearsInEditais: (caseData.appearsInEditais || []).map(a => a?.trim()).filter(Boolean),
    mnemonics: (caseData.mnemonics || []).map(m => m?.trim()).filter(Boolean),
    references: (caseData.references || []).map(r => r?.trim()).filter(Boolean),
    tags: (caseData.tags || []).map(t => t?.toLowerCase().trim()).filter(Boolean),
  };
}

// Sincronizar com banco em batch
async function syncToDatabase(cases) {
  log(colors.cyan, '\n📊 Sincronizando com banco de dados (batch)...\n');

  let created = 0;
  let updated = 0;
  let errors = 0;

  // Processar em batches de 10 para evitar sobrecarga
  const batchSize = 10;

  for (let i = 0; i < cases.length; i += batchSize) {
    const batch = cases.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map((caseData) => processSingleCase(caseData))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        if (result.value.created) created++;
        else updated++;
      } else {
        errors++;
        log(colors.red, `  ❌ ${result.reason.message}`);
      }
    }

    // Progress
    const progress = Math.min(i + batchSize, cases.length);
    log(colors.yellow, `  ⏳ Processados: ${progress}/${cases.length}`);
  }

  return { created, updated, errors };
}

async function processSingleCase(caseData) {
  const originSource = caseData.origin?.source || 'Geral';
  const originConcurso = caseData.origin?.concurso || null;
  const originYear = caseData.origin?.year || null;
  const srsWeight = caseData.srs?.memoryWeight || 1.0;
  const srsInterval = caseData.srs?.initialIntervalDays || 1;

  const mnemonicsData = (caseData.mnemonics || []).map((text) => ({
    text: text.trim(),
  }));

  const referencesData = (caseData.references || []).map((text) => ({
    text: text.trim(),
  }));

  // Processar tags
  const tagsData = caseData.tags || [];
  const tagRecords = [];

  for (const tagName of tagsData) {
    const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
    let tag = await prisma.tag.findUnique({
      where: { slug: tagSlug },
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug: tagSlug,
        },
      });
    }
    tagRecords.push(tag);
  }

  // Verificar se já existe
  const existing = await prisma.case.findUnique({
    where: { code: caseData.code },
  });

  const isCreated = !existing;

  // Upsert
  await prisma.case.upsert({
    where: { code: caseData.code },
    update: {
      title: caseData.title,
      slug: caseData.slug,
      axis: caseData.axis,
      topic: caseData.topic,
      subtopics: caseData.subtopics || [],
      conceptCore: caseData.conceptCore || null,
      originSource,
      originConcurso,
      originYear: originYear || undefined,
      narrativeMd: caseData.narrativeMd,
      conflict: caseData.conflict,
      explanationMd: caseData.explanationMd,
      applicationMd: caseData.applicationMd,
      keyIdea: caseData.keyIdea || null,
      proofTip: caseData.proofTip || null,
      context: caseData.context || null,
      level: caseData.level || 1,
      priority: caseData.priority || 'media',
      simpleEmenda: caseData.simpleEmenda,
      prerequisites: caseData.prerequisites || [],
      nextTopics: caseData.nextTopics || [],
      appearsInEditais: caseData.appearsInEditais || [],
      srsWeight,
      srsInterval,
      isPublished: true,
    },
    create: {
      code: caseData.code,
      title: caseData.title,
      slug: caseData.slug,
      axis: caseData.axis,
      topic: caseData.topic,
      subtopics: caseData.subtopics || [],
      conceptCore: caseData.conceptCore || null,
      originSource,
      originConcurso,
      originYear: originYear || undefined,
      narrativeMd: caseData.narrativeMd,
      conflict: caseData.conflict,
      explanationMd: caseData.explanationMd,
      applicationMd: caseData.applicationMd,
      keyIdea: caseData.keyIdea || null,
      proofTip: caseData.proofTip || null,
      context: caseData.context || null,
      level: caseData.level || 1,
      priority: caseData.priority || 'media',
      simpleEmenda: caseData.simpleEmenda,
      prerequisites: caseData.prerequisites || [],
      nextTopics: caseData.nextTopics || [],
      appearsInEditais: caseData.appearsInEditais || [],
      srsWeight,
      srsInterval,
      isPublished: true,
      mnemonics: {
        create: mnemonicsData,
      },
      references: {
        create: referencesData,
      },
      tags: {
        create: tagRecords.map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
  });

  const status = isCreated ? '✅ Criado' : '🔄 Atualizado';
  log(colors.green, `  ${status}: ${caseData.code}`);

  return { created: isCreated };
}

// Main
async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    log(colors.red, '❌ Uso: npm run add-cases:batch <arquivo.json>');
    log(colors.yellow, '\nExemplo:');
    log(colors.yellow, '  npm run add-cases:batch ./novos-casos.json');
    process.exit(1);
  }

  try {
    log(colors.blue, '\n🚀 === ADIÇÃO DE CASOS EM BATCH ===\n');

    // 1. Ler arquivo
    log(colors.blue, '📖 Lendo arquivo...');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remover prefixo de texto
    if (!fileContent.trim().startsWith('{')) {
      const jsonStart = fileContent.indexOf('{');
      if (jsonStart === -1) throw new Error('Arquivo não contém JSON válido');
      fileContent = fileContent.substring(jsonStart);
    }

    const jsonData = JSON.parse(fileContent);
    let cases = jsonData.cases || [];

    if (cases.length === 0) throw new Error('Nenhum caso encontrado');

    log(colors.green, `✅ ${cases.length} casos encontrados\n`);

    // 2. Normalizar
    log(colors.blue, '🔄 Normalizando dados...');
    cases = cases.map((c) => normalizeCase(c));
    log(colors.green, '✅ Normalização concluída\n');

    // 3. Validar
    log(colors.blue, '✔️  Validando estrutura...');
    cases.forEach((c, i) => validateCase(c, i + 1));
    log(colors.green, '✅ Validação concluída\n');

    // 4. Verificar duplicatas
    log(colors.blue, '🔍 Verificando duplicatas...');
    const codes = new Set();
    for (const c of cases) {
      if (codes.has(c.code)) {
        throw new Error(`Code duplicado no arquivo: ${c.code}`);
      }
      codes.add(c.code);
    }
    log(colors.green, '✅ Sem duplicatas\n');

    // 5. Sincronizar
    const stats = await syncToDatabase(cases);

    // Resumo
    log(colors.blue, '\n📊 === RESUMO ===\n');
    log(colors.green, `✅ Criados: ${stats.created}`);
    log(colors.yellow, `🔄 Atualizados: ${stats.updated}`);
    if (stats.errors > 0) {
      log(colors.red, `❌ Erros: ${stats.errors}`);
    }

    const total = await prisma.case.count();
    log(colors.cyan, `\n📈 Total de casos no banco: ${total}\n`);

    log(colors.green, '✨ Sucesso! Casos adicionados ao banco.\n');
  } catch (error) {
    log(colors.red, `\n❌ Erro: ${error.message}\n`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
