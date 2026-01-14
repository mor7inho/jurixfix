const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed com casos combinados...\n');

  try {
    // Ler ambos os arquivos JSON
    const casesPath = path.join(process.cwd(), 'data', 'cases.json');
    const casesNewPath = path.join(process.cwd(), 'data', 'cases_new.json');

    const casesFile = fs.readFileSync(casesPath, 'utf-8');
    const casesNewFile = fs.readFileSync(casesNewPath, 'utf-8');

    const casesData = JSON.parse(casesFile);
    const casesNewData = JSON.parse(casesNewFile);

    // Combinar os casos
    const allCases = [
      ...(casesData.cases || []),
      ...(casesNewData.cases || []),
    ];

    console.log(`📚 Encontrados ${allCases.length} casos no total\n`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const caseData of allCases) {
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
          console.log(`✅ Criado/Atualizado: ${result.code}`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${caseData.code}:`, error.message);
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Casos processados: ${createdCount}`);
    console.log(`   📈 Total no DB: ${allCases.length}`);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
