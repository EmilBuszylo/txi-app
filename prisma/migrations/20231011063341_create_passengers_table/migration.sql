-- CreateTable
CREATE TABLE "passengers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phones" TEXT[],
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToPassenger" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToPassenger_AB_unique" ON "_ClientToPassenger"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToPassenger_B_index" ON "_ClientToPassenger"("B");

-- AddForeignKey
ALTER TABLE "_ClientToPassenger" ADD CONSTRAINT "_ClientToPassenger_A_fkey" FOREIGN KEY ("A") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToPassenger" ADD CONSTRAINT "_ClientToPassenger_B_fkey" FOREIGN KEY ("B") REFERENCES "passengers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
