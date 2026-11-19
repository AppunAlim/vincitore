-- CreateTable
CREATE TABLE "Kursus" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "jadwal" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "halamanDetail" TEXT NOT NULL,

    CONSTRAINT "Kursus_pkey" PRIMARY KEY ("id")
);
