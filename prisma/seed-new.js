const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adicionando novos casos ao banco...\n');

  try {
    const casesPath = path.join(process.cwd(), 'data', 'cases_new_clean.json');
    const casesFile = fs.readFileSync(casesPath, 'utf-8');
    const casesData = JSON.parse(casesFile);
    const cases = casesData.cases || [];

    console.log(`📚 Encontrados ${cases.length} casos para adicionar\n`);

    let count = 0;
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
              deleteMany: {},
              create: mnemonicsData,
            },
            references: {
              deleteMany: {},
              create: referencesData,
            },
            tags: {
              deleteMany: {},
              create: tagRecords.map((tag) => ({
                tagId: tag.id,
              })),
            },
          },
          create: {
            code: caseData.code,
            title: caseData.title,
            slug: caseData.slug,
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

        console.log(`✅ ${result.code}: ${result.title}`);
        count++;
      } catch (error) {
        console.error(`❌ Erro ao processar ${caseData.code}:`, error.message);
      }
    }

    console.log(`\n📊 Total adicionado: ${count} casos`);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
