-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "internalId" TEXT NOT NULL,
    "externalId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_internalId_key" ON "orders"("internalId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_externalId_key" ON "orders"("externalId");
