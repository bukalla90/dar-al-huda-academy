/*
  Warnings:

  - You are about to drop the column `studentId` on the `ClassSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassSession" DROP CONSTRAINT "ClassSession_studentId_fkey";

-- AlterTable
ALTER TABLE "ClassSession" DROP COLUMN "studentId";

-- CreateTable
CREATE TABLE "SessionStudent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "SessionStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionStudent_sessionId_studentId_key" ON "SessionStudent"("sessionId", "studentId");

-- AddForeignKey
ALTER TABLE "SessionStudent" ADD CONSTRAINT "SessionStudent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionStudent" ADD CONSTRAINT "SessionStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
