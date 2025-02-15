/*
  Warnings:

  - A unique constraint covering the columns `[transactionHash]` on the table `PendingTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PendingTransaction_transactionHash_key" ON "PendingTransaction"("transactionHash");
