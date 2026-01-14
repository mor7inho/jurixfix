import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface CaseData {
  id: string;
  code: string;
  title: string;                           // Novo campo
  slug: string;
  axis?: string;
  topic: string;
  subtopics?: string[];
  conceptCore?: string;
  context?: string;
  origin?: {
    source?: string;
    concurso?: string;
    year?: number;
  };
  level?: number;
  priority?: string;
  narrativeMd: string;
  conflict: string;
  explanationMd: string;
  applicationMd: string;
  simpleEmenda: string;
  keyIdea?: string;
  proofTip?: string;
  mnemonics?: string[];
  prerequisites?: string[];
  nextTopics?: string[];
  appearsInEditais?: string[];
  srs?: {
    memoryWeight?: number;
    initialIntervalDays?: number;
  };
  references?: string[];
  tags?: string[];
}

interface CasesJSON {
  discipline: { name: string; slug: string };
  module: { name: string; slug: string; order: number };
  cases: CaseData[];
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados com novo schema...');

  try {
    // Ler arquivo JSON
    const casesPath = path.join(process.cwd(), 'data', 'cases.json');
    const casesFile = fs.readFileSync(casesPath, 'utf-8');
    const casesData: CasesJSON = JSON.parse(casesFile);

    const cases = casesData.cases || [];
    console.log(`📚 Encontrados ${cases.length} casos no JSON\n`);

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const caseData of cases) {
      try {
        // Mapear dados de origem
        const originSource = caseData.origin?.source || 'Geral';
        const originConcurso = caseData.origin?.concurso || null;
        const originYear = caseData.origin?.year || null;

        // Mapear dados de SRS
        const srsWeight = caseData.srs?.memoryWeight || 1.0;
        const srsInterval = caseData.srs?.initialIntervalDays || 1;

        // Preparar mnemonics
        const mnemonicsData = (caseData.mnemonics || []).map((text) => ({
          text: text.trim(),
        }));

        // Preparar references
        const referencesData = (caseData.references || []).map((text) => ({
          text: text.trim(),
        }));

        // Preparar tags
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

        // Usar upsert para garantir que os dados entrem corretamente
        const result = await prisma.case.upsert({
          where: { code: caseData.code },
          update: {
            title: caseData.title,
            slug: caseData.slug || caseData.code.toLowerCase().replace(/\s+/g, '-'),
            axis: caseData.axis,
            topic: caseData.topic,
            subtopics: caseData.subtopics || [],
            conceptCore: caseData.conceptCore,
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
              deleteMany: {}, // Limpar mnemonics antigos
              create: mnemonicsData,
            },
            references: {
              deleteMany: {}, // Limpar references antigos
              create: referencesData,
            },
            tags: {
              deleteMany: {}, // Limpar tags antigas
              create: tagRecords.map((tag) => ({
                tagId: tag.id,
              })),
            },
          },
          create: {
            code: caseData.code,
            title: caseData.title,
            slug: caseData.slug || caseData.code.toLowerCase().replace(/\s+/g, '-'),
            axis: caseData.axis,
            topic: caseData.topic,
            subtopics: caseData.subtopics || [],
            conceptCore: caseData.conceptCore,
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

        if (result) {
          if (
            mnemonicsData.length > 0 ||
            referencesData.length > 0 ||
            tagRecords.length > 0
          ) {
            console.log(`✅ Criado/Atualizado: ${result.code}`);
            createdCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${caseData.code}:`, error);
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Casos processados: ${createdCount}`);
    console.log(`   📈 Total no DB: ${cases.length}`);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
