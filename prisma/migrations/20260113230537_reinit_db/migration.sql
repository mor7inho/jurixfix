-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "axis" TEXT,
    "topic" TEXT NOT NULL,
    "originSource" TEXT NOT NULL DEFAULT 'Geral',
    "originConcurso" TEXT,
    "originYear" INTEGER,
    "narrativeMd" TEXT NOT NULL,
    "conflict" TEXT NOT NULL,
    "explanationMd" TEXT NOT NULL,
    "applicationMd" TEXT NOT NULL,
    "keyIdea" TEXT,
    "proofTip" TEXT,
    "context" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "priority" TEXT NOT NULL DEFAULT 'media',
    "simpleEmenda" TEXT NOT NULL,
    "srsWeight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mnemonic" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,

    CONSTRAINT "Mnemonic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseTag" (
    "caseId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "CaseTag_pkey" PRIMARY KEY ("caseId","tagId")
);

-- CreateTable
CREATE TABLE "StudentProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "rating" INTEGER,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3),
    "lastReview" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStatistics" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "timesReviewed" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_code_key" ON "Case"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Case_slug_key" ON "Case"("slug");

-- CreateIndex
CREATE INDEX "Mnemonic_caseId_idx" ON "Mnemonic"("caseId");

-- CreateIndex
CREATE INDEX "Reference_caseId_idx" ON "Reference"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "CaseTag_caseId_idx" ON "CaseTag"("caseId");

-- CreateIndex
CREATE INDEX "CaseTag_tagId_idx" ON "CaseTag"("tagId");

-- CreateIndex
CREATE INDEX "StudentProgress_studentId_idx" ON "StudentProgress"("studentId");

-- CreateIndex
CREATE INDEX "StudentProgress_caseId_idx" ON "StudentProgress"("caseId");

-- CreateIndex
CREATE INDEX "StudentProgress_nextReview_idx" ON "StudentProgress"("nextReview");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProgress_studentId_caseId_key" ON "StudentProgress"("studentId", "caseId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStatistics_caseId_key" ON "CaseStatistics"("caseId");

-- AddForeignKey
ALTER TABLE "Mnemonic" ADD CONSTRAINT "Mnemonic_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseTag" ADD CONSTRAINT "CaseTag_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseTag" ADD CONSTRAINT "CaseTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProgress" ADD CONSTRAINT "StudentProgress_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatistics" ADD CONSTRAINT "CaseStatistics_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
