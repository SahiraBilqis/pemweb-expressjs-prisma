const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'Buku', price: 15000 },
      { name: 'Pulpen', price: 5000 }
    ]
  });

  console.log('Data awal berhasil ditambahkan ke database PostgreSQL');
}

main()
  .catch((e) => {
    console.error('Gagal melakukan seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
