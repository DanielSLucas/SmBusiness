/*
  Warnings:

  - The primary key for the `movements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `movements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `movementId` on the `movements_tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "movements_tags" DROP CONSTRAINT "movements_tags_movementId_fkey";

-- AlterTable
ALTER TABLE "movements" DROP CONSTRAINT "movements_pkey",
ADD COLUMN     "refId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "movements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "movements_tags" DROP COLUMN "movementId",
ADD COLUMN     "movementId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "movements_tags" ADD CONSTRAINT "movements_tags_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
