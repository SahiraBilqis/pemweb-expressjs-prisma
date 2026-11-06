const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET semua produk dari database PostgreSQL
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
};

// GET produk berdasarkan ID dari database PostgreSQL
exports.getProductById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan'
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
};

// POST /products - placeholder sebelum migrasi create ke Prisma
exports.createProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Nama dan harga produk wajib diisi' });
  }
  return res.status(201).json({ id: 1, name, price });
};
