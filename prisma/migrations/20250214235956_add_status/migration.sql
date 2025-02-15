/*
  Warnings:

  - Added the required column `status` to the `PendingTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- AlterTable
ALTER TABLE "PendingTransaction" ADD COLUMN     "status" "TransactionStatus" NOT NULL;
