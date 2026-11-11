-- CreateEnum
CREATE TYPE "LoyaltyEventType" AS ENUM ('STAMP', 'REDEMPTION', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "LoyaltyBusiness" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyStaff" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoyaltyStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyProgram" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "stampsRequired" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyCard" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyStampEvent" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "type" "LoyaltyEventType" NOT NULL,
    "stampsDelta" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoyaltyStampEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyBusiness_slug_key" ON "LoyaltyBusiness"("slug");

-- CreateIndex
CREATE INDEX "LoyaltyBusiness_clientId_idx" ON "LoyaltyBusiness"("clientId");

-- CreateIndex
CREATE INDEX "LoyaltyStaff_userId_idx" ON "LoyaltyStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyStaff_businessId_userId_key" ON "LoyaltyStaff"("businessId", "userId");

-- CreateIndex
CREATE INDEX "LoyaltyProgram_businessId_active_idx" ON "LoyaltyProgram"("businessId", "active");

-- CreateIndex
CREATE INDEX "LoyaltyCard_userId_idx" ON "LoyaltyCard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyCard_programId_userId_key" ON "LoyaltyCard"("programId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyStampEvent_idempotencyKey_key" ON "LoyaltyStampEvent"("idempotencyKey");

-- CreateIndex
CREATE INDEX "LoyaltyStampEvent_cardId_createdAt_idx" ON "LoyaltyStampEvent"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "LoyaltyStampEvent_actorId_idx" ON "LoyaltyStampEvent"("actorId");

-- AddForeignKey
ALTER TABLE "LoyaltyBusiness" ADD CONSTRAINT "LoyaltyBusiness_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyStaff" ADD CONSTRAINT "LoyaltyStaff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "LoyaltyBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyStaff" ADD CONSTRAINT "LoyaltyStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyProgram" ADD CONSTRAINT "LoyaltyProgram_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "LoyaltyBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyCard" ADD CONSTRAINT "LoyaltyCard_programId_fkey" FOREIGN KEY ("programId") REFERENCES "LoyaltyProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyCard" ADD CONSTRAINT "LoyaltyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyStampEvent" ADD CONSTRAINT "LoyaltyStampEvent_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LoyaltyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyStampEvent" ADD CONSTRAINT "LoyaltyStampEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- The first version is server-only. No anonymous or authenticated Data API
-- access is granted; authorization must be enforced by the server.
ALTER TABLE "LoyaltyBusiness" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyStaff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyProgram" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyStampEvent" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "LoyaltyBusiness", "LoyaltyStaff", "LoyaltyProgram", "LoyaltyCard", "LoyaltyStampEvent" FROM PUBLIC, anon, authenticated;

ALTER TABLE "LoyaltyProgram" ADD CONSTRAINT "LoyaltyProgram_stampsRequired_positive" CHECK ("stampsRequired" > 0);
ALTER TABLE "LoyaltyStampEvent" ADD CONSTRAINT "LoyaltyStampEvent_delta_nonzero" CHECK ("stampsDelta" <> 0);
