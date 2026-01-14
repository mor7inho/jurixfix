import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import DashboardContent from '@/components/DashboardContent';
import { Case } from '@/types/case';

const prisma = new PrismaClient();

function DashboardLoadingFallback() {
  return (
    <div className="p-4 md:p-8 w-full">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

async function getDashboardCases(): Promise<Case[]> {
  try {
    const cases = await prisma.case.findMany({
      where: { isPublished: true },
      include: {
        mnemonics: true,
        references: true,
        tags: {
          include: { tag: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cases.map((caseItem: any) => ({
      code: caseItem.code,
      title: caseItem.title || '',
      slug: caseItem.slug,
      topic: caseItem.topic || '',
      context: caseItem.context,
      simpleEmenda: caseItem.simpleEmenda || '',
      createdAt: caseItem.createdAt?.toISOString(),
      level: caseItem.level || 1,
      priority: caseItem.priority || 'media',
      isPublished: caseItem.isPublished,
      category: caseItem.category,
      narrativeMd: caseItem.narrativeMd || '',
      conflict: caseItem.conflict || '',
      explanationMd: caseItem.explanationMd || '',
      applicationMd: caseItem.applicationMd || '',
      keyIdea: caseItem.keyIdea,
      proofTip: caseItem.proofTip,
      mnemonics: caseItem.mnemonics.map((m: any) => m.mnemonic),
      references: caseItem.references.map((r: any) => r.reference),
      tags: caseItem.tags.map((t: any) => t.tag.name),
    })) as Case[];
  } catch (error) {
    console.error('Erro ao buscar casos do banco:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const cases = await getDashboardCases();

  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <DashboardContent initialCases={cases} />
    </Suspense>
  );
}
