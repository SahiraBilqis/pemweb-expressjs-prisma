// Data awal di array tanpa database
const products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

// GET /products - menampilkan seluruh produk
exports.getAllProducts = (req, res) => {
  res.status(200).json(products);
};

// GET /products/:id - menampilkan produk berdasarkan ID
exports.getProductById = (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json(product);
};
