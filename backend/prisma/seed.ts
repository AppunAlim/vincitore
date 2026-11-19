import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const daftarKursus = [
    {
      id: '1',
      nama: 'Bahasa Inggris',
      level: 'Pemula',
      jadwal: 'Senin & Rabu, 19.00',
      harga: 199999,
      halamanDetail: 'detail-inggris.html',
    },
    {
      id: '2',
      nama: 'Bahasa Inggris',
      level: 'Lanjutan',
      jadwal: 'Selasa & Kamis, 19.00',
      harga: 249999,
      halamanDetail: 'detail-inggris.html',
    },
    {
      id: '3',
      nama: 'Bahasa Arab',
      level: 'Pemula',
      jadwal: 'Sabtu, 09.00',
      harga: 199999,
      halamanDetail: 'detail-arab.html',
    },
    {
      id: '4',
      nama: 'Bahasa Jepang',
      level: 'Pemula',
      jadwal: 'Minggu, 09.00',
      harga: 199999,
      halamanDetail: 'detail-jepang.html',
    },
  ];

  for (const kursus of daftarKursus) {
    await prisma.kursus.upsert({
      where: { id: kursus.id },
      update: {},
      create: kursus,
    });
  }

  console.log('Data kursus berhasil dimasukkan!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
