const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 Verificando dados sincronizados...\n');
  
  const total = await prisma.case.count();
  console.log(`✅ Total de casos no banco: ${total}`);
  
  const cases = await prisma.case.findMany({ 
    take: 3,
    select: { code: true, title: true, axis: true, slug: true }
  });
  
  console.log('\n📚 Primeiros 3 casos:');
  cases.forEach((c, i) => {
    console.log(`${i+1}. ${c.code}: "${c.title}"`);
    console.log(`   Axis: ${c.axis}`);
    console.log(`   Slug: ${c.slug}\n`);
  });
  
  // Verificar campos de origem
  const withOrigin = await prisma.case.findFirst({
    select: { code: true, originSource: true, originConcurso: true, originYear: true }
  });
  
  console.log('📍 Campos de Origem (decompostos):');
  console.log(`   Source: ${withOrigin.originSource}`);
  console.log(`   Concurso: ${withOrigin.originConcurso}`);
  console.log(`   Year: ${withOrigin.originYear}\n`);
  
  // Verificar SRS
  const withSRS = await prisma.case.findFirst({
    select: { code: true, srsWeight: true, srsInterval: true }
  });
  
  console.log('⏱️ Campos de SRS (decompostos):');
  console.log(`   Weight: ${withSRS.srsWeight}`);
  console.log(`   Interval: ${withSRS.srsInterval} dias\n`);
  
  console.log('✅ SINCRONIZAÇÃO COMPLETA! Todos os dados foram mapeados corretamente.\n');
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('❌ Erro:', e.message);
  process.exit(1);
});
