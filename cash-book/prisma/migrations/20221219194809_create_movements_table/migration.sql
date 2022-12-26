-- CreateEnum
CREATE TYPE "Movement_type" AS ENUM ('INCOME', 'OUTCOME');

-- CreateTable
CREATE TABLE "movements" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "Movement_type" NOT NULL,
    "authUserId" TEXT NOT NULL,

    CONSTRAINT "movements_pkey" PRIMARY KEY ("id")
);
