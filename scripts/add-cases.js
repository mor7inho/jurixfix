#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

  for (const field of requiredFields) {
    if (!caseData[field]) {
      throw new Error(`Caso ${index}: Campo obrigatório "${field}" faltando`);
    }
  }

  if (typeof caseData.level !== 'number' || caseData.level < 1 || caseData.level > 4) {
    throw new Error(`Caso ${index}: "level" deve ser 1-4`);
  }

  if (!['altissima', 'alta', 'media', 'baixa'].includes(caseData.priority)) {
    throw new Error(`Caso ${index}: "priority" inválida`);
  }

  return true;
}

// Sincronizar com banco de dados
async function syncToDatabase(cases) {
  log(colors.blue, '📊 Sincronizando com banco de dados...');

  let created = 0;
  let updated = 0;

  for (const caseData of cases) {
    try {
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

      const result = await prisma.case.upsert({
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

      // Verificar se foi criado ou atualizado
      const existingCase = await prisma.case.findUnique({
        where: { code: caseData.code },
      });

      if (result.createdAt === result.updatedAt) {
        created++;
        log(colors.green, `  ✅ Criado: ${result.code}`);
      } else {
        updated++;
        log(colors.yellow, `  🔄 Atualizado: ${result.code}`);
      }
    } catch (error) {
      log(colors.red, `  ❌ Erro em ${caseData.code}: ${error.message}`);
      throw error;
    }
  }

  return { created, updated };
}

// Atualizar JSON local
function updateCasesJson(newCases) {
  log(colors.blue, '📝 Atualizando cases.json...');

  const casesPath = path.join(process.cwd(), 'data', 'cases.json');
  const casesData = JSON.parse(fs.readFileSync(casesPath, 'utf-8'));

  // Remover duplicatas (por code)
  const existingCodes = new Set(casesData.cases.map(c => c.code));
  const casesToAdd = newCases.filter(c => !existingCodes.has(c.code));

  casesData.cases.push(...casesToAdd);

  fs.writeFileSync(casesPath, JSON.stringify(casesData, null, 2));
  log(colors.green, `  ✅ ${casesToAdd.length} novos casos adicionados ao JSON`);

  return casesData.cases.length;
}

// Executar build
async function runBuild() {
  log(colors.blue, '🔨 Fazendo build do site...');

  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
    log(colors.green, '  ✅ Build concluído com sucesso');
    return true;
  } catch (error) {
    log(colors.red, '  ❌ Build falhou');
    return false;
  }
}

// Main
async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    log(colors.red, '❌ Uso: npm run add-cases <caminho-do-json>');
    log(colors.yellow, '\nExemplo:');
    log(colors.yellow, '  npm run add-cases ./novos-casos.json');
    process.exit(1);
  }

  try {
    log(colors.blue, '🚀 Iniciando adição de novos casos...\n');

    // 1. Ler e validar arquivo de entrada
    log(colors.blue, '📖 Lendo arquivo de entrada...');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remover prefixo de texto se houver
    if (!fileContent.trim().startsWith('{')) {
      const jsonStart = fileContent.indexOf('{');
      if (jsonStart === -1) {
        throw new Error('Arquivo não contém JSON válido');
      }
      fileContent = fileContent.substring(jsonStart);
    }

    const jsonData = JSON.parse(fileContent);
    const cases = jsonData.cases || [];

    if (cases.length === 0) {
      throw new Error('Nenhum caso encontrado no arquivo');
    }

    log(colors.green, `  ✅ ${cases.length} casos encontrados\n`);

    // 2. Validar estrutura
    log(colors.blue, '✔️  Validando estrutura dos casos...');
    cases.forEach((caseData, index) => {
      validateCase(caseData, index + 1);
    });
    log(colors.green, '  ✅ Todos os casos válidos\n');

    // 3. Sincronizar com banco
    const dbStats = await syncToDatabase(cases);
    log(colors.green, `  ✅ ${dbStats.created} criados, ${dbStats.updated} atualizados\n`);

    // 4. Atualizar JSON
    const totalCases = updateCasesJson(cases);
    log(colors.green, `  ✅ Total de casos no JSON: ${totalCases}\n`);

    // 5. Fazer build
    const buildSuccess = await runBuild();

    if (buildSuccess) {
      log(colors.green, '\n✨ Sucesso! Novos casos adicionados e site atualizado\n');
      log(colors.yellow, 'Próximos passos:');
      log(colors.yellow, '  1. npm run dev (para ver localmente)');
      log(colors.yellow, '  2. git add -A && git commit -m "Add new cases"');
      log(colors.yellow, '  3. git push (fará deploy automático)\n');
    } else {
      log(colors.red, '\n⚠️  Casos foram adicionados, mas build falhou');
      log(colors.yellow, 'Execute: npm run build\n');
    }
  } catch (error) {
    log(colors.red, `\n❌ Erro: ${error.message}\n`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
