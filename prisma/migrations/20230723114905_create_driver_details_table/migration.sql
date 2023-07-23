-- CreateTable
CREATE TABLE "driver_details" (
    "id" TEXT NOT NULL,
    "carModel" TEXT,
    "carBrand" TEXT,
    "carColor" TEXT,
    "carRegistrationNumber" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "driver_details_userId_key" ON "driver_details"("userId");

-- AddForeignKey
ALTER TABLE "driver_details" ADD CONSTRAINT "driver_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
