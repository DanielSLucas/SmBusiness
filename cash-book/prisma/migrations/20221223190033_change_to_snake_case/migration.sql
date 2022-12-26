/*
  Warnings:

  - You are about to drop the column `authUserId` on the `movements` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `movements` table. All the data in the column will be lost.
  - You are about to drop the column `refId` on the `movements` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `movements` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `movements_tags` table. All the data in the column will be lost.
  - You are about to drop the column `movementId` on the `movements_tags` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `movements_tags` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `movements_tags` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tags` table. All the data in the column will be lost.
  - Added the required column `auth_user_id` to the `movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movement_id` to the `movements_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `movements_tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "movements_tags" DROP CONSTRAINT "movements_tags_movementId_fkey";

-- DropForeignKey
ALTER TABLE "movements_tags" DROP CONSTRAINT "movements_tags_tagId_fkey";

-- AlterTable
ALTER TABLE "movements" DROP COLUMN "authUserId",
DROP COLUMN "createdAt",
DROP COLUMN "refId",
DROP COLUMN "updatedAt",
ADD COLUMN     "auth_user_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ref_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "movements_tags" DROP COLUMN "createdAt",
DROP COLUMN "movementId",
DROP COLUMN "tagId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "movement_id" INTEGER NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "movements_tags" ADD CONSTRAINT "movements_tags_movement_id_fkey" FOREIGN KEY ("movement_id") REFERENCES "movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements_tags" ADD CONSTRAINT "movements_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
