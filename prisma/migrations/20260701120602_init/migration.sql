/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Material` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_teacherId_fkey";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "teacherId";
