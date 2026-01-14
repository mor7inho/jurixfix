import { PrismaClient } from '@prisma/client';

async function verifyDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando tabelas do Supabase...\n');
    
    // Contar casos
    const caseCount = await prisma.case.count();
    console.log(`✅ Tabela "Case": ${caseCount} registos`);
    
    // Contar tags
    const tagCount = await prisma.tag.count();
    console.log(`✅ Tabela "Tag": ${tagCount} registos`);
    
    // Contar mnemonics
    const mnemonicCount = await prisma.mnemonic.count();
    console.log(`✅ Tabela "Mnemonic": ${mnemonicCount} registos`);
    
    // Contar references
    const referenceCount = await prisma.reference.count();
    console.log(`✅ Tabela "Reference": ${referenceCount} registos`);
    
    // Contar CaseTag
    const caseTagCount = await prisma.caseTag.count();
    console.log(`✅ Tabela "CaseTag": ${caseTagCount} registos`);
    
    // Mostrar alguns casos
    if (caseCount > 0) {
      console.log('\n📚 Primeiros 3 casos:');
      const cases = await prisma.case.findMany({
        take: 3,
        include: {
          tags: { include: { tag: true } },
          mnemonics: true,
          references: true
        }
      });
      
      cases.forEach((c, i) => {
        console.log(`\n  ${i + 1}. ${c.code} - ${c.title}`);
        console.log(`     Topic: ${c.topic}`);
        console.log(`     Level: ${c.level} | Priority: ${c.priority}`);
        console.log(`     Tags: ${c.tags.map(ct => ct.tag.name).join(', ') || 'Nenhuma'}`);
        console.log(`     Mnemonics: ${c.mnemonics.length} | References: ${c.references.length}`);
      });
    }
    
    console.log('\n✨ Banco de dados verificado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
