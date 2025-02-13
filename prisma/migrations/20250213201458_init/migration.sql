-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('OPTIMISM', 'BASE', 'LINEA', 'ARBITRUM', 'AVALANCHE');

-- CreateTable
CREATE TABLE "UserMultisig" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "multisigAddress" TEXT NOT NULL,
    "chain" "Chain" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMultisig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMultisig_userAddress_chain_key" ON "UserMultisig"("userAddress", "chain");

-- CreateIndex
CREATE UNIQUE INDEX "UserMultisig_multisigAddress_chain_key" ON "UserMultisig"("multisigAddress", "chain");
