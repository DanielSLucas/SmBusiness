/*
  Warnings:

  - Added the required column `date` to the `movements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movements" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
