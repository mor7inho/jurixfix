/*
  Warnings:

  - You are about to drop the column `proofTip` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Case` table. All the data in the column will be lost.
  - Added the required column `conceptCore` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Made the column `axis` on table `Case` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originYear` on table `Case` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "proofTip",
DROP COLUMN "title",
ADD COLUMN     "appearsInEditais" TEXT[],
ADD COLUMN     "conceptCore" TEXT NOT NULL,
ADD COLUMN     "nextTopics" TEXT[],
ADD COLUMN     "prerequisites" TEXT[],
ADD COLUMN     "srsInterval" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "subtopics" TEXT[],
ALTER COLUMN "axis" SET NOT NULL,
ALTER COLUMN "originYear" SET NOT NULL,
ALTER COLUMN "originYear" SET DEFAULT 2024;
