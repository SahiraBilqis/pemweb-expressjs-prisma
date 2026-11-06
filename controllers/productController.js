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

// POST produk baru ke database PostgreSQL
exports.createProduct = async (req, res) => {
  const { name, price } = req.body;

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    !Number.isSafeInteger(Number(price)) ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      message: 'Nama dan harga produk tidak valid'
    });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: Number(price)
      }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan produk' });
  }
};
