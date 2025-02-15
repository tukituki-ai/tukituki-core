-- CreateTable
CREATE TABLE "ActionLog" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "multisigAddress" TEXT NOT NULL,
    "chain" "Chain" NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionLog_userAddress_chain_key" ON "ActionLog"("userAddress", "chain");

-- CreateIndex
CREATE UNIQUE INDEX "ActionLog_multisigAddress_chain_key" ON "ActionLog"("multisigAddress", "chain");
