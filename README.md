# Pemrograman Web - Express.js & Prisma ORM (PostgreSQL)

Proyek REST API menggunakan **Express.js**, **Prisma ORM**, dan **PostgreSQL** untuk mengelola data produk (CRUD). Proyek ini mencakup tugas **Week 9** (arsitektur modular Express & in-memory storage) dan lanjutannya pada **Week 10** (integrasi database relasional menggunakan Prisma ORM).

---

## 📁 Struktur Folder

```text
expressjs/
├── controllers/
│   └── productController.js     # Handler HTTP request dan operasi database Prisma
├── prisma/
│   ├── migrations/              # Riwayat migrasi database SQL
│   └── schema.prisma            # Definisi model data Product dan konfigurasi datasource
├── routes/
│   └── productRoutes.js         # Pemetaan endpoint HTTP ke controller
├── screenshots/                 # Bukti pengujian endpoint
├── .env.example                 # Template environment variable
├── .gitignore                   # Mengabaikan node_modules dan .env
├── app.js                       # File entry point aplikasi Express
├── package.json                 # Konfigurasi dependensi proyek
└── README.md                    # Dokumentasi lengkap proyek
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
- **Node.js** (v18 atau lebih baru)
- **PostgreSQL Database** (Lokal atau Cloud seperti Neon Database)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`, lalu sesuaikan kredensial database Anda:
```bash
cp .env.example .env
```
Isi file `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
PORT=3000
```

### 4. Menjalankan Migrasi Database & Prisma Client
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Menjalankan Server
```bash
node app.js
```
Server akan berjalan di: `http://localhost:3000`.

---

## 📌 Daftar Endpoint REST API

| Method | Endpoint | Keterangan | Status Sukses |
|---|---|---|---|
| **GET** | `/products` | Menampilkan seluruh produk | `200 OK` |
| **GET** | `/products/:id` | Menampilkan detail produk berdasarkan ID | `200 OK` |
| **POST** | `/products` | Menambahkan produk baru | `201 Created` |
| **PUT** | `/products/:id` / `/products` | Mengupdate data produk yang ada | `200 OK` |
| **DELETE** | `/products/:id` | Menghapus produk berdasarkan ID | `200 OK` |

---

## 📖 Contoh Request & Response

### 1. GET Semua Produk
- **URL**: `GET http://localhost:3000/products`
- **Response** (`200 OK`):
```json
[
  { "id": 1, "name": "Buku", "price": 15000 },
  { "id": 2, "name": "Pulpen", "price": 5000 }
]
```

---

### 2. GET Produk Berdasarkan ID
- **URL**: `GET http://localhost:3000/products/1`
- **Response** (`200 OK`):
```json
{
  "id": 1,
  "name": "Buku",
  "price": 15000
}
```
- **Error (404 Not Found)**: `GET http://localhost:3000/products/999`
```json
{
  "message": "Produk tidak ditemukan"
}
```

---

### 3. POST Tambah Produk Baru
- **URL**: `POST http://localhost:3000/products`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Pensil 2B",
  "price": 3500
}
```
- **Response** (`201 Created`):
```json
{
  "id": 3,
  "name": "Pensil 2B",
  "price": 3500
}
```

---

### 4. PUT Update Produk
Mendukung format ID melalui URL parameter maupun request body:
- **URL**: `PUT http://localhost:3000/products/1` atau `PUT http://localhost:3000/products`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "id": 1,
  "name": "Buku Tulis Hardcover",
  "price": 18000
}
```
- **Response** (`200 OK`):
```json
{
  "id": 1,
  "name": "Buku Tulis Hardcover",
  "price": 18000
}
```

---

### 5. DELETE Hapus Produk
- **URL**: `DELETE http://localhost:3000/products/2`
- **Response** (`200 OK`):
```json
{
  "message": "Produk berhasil dihapus"
}
```

---

## 🧪 Skenario Penanganan Error & Validasi

1. **Validasi Input Gagal (`400 Bad Request`)**:
   - Jika `name` kosong atau bertipe salah.
   - Jika `price` negatif atau bukan angka.
   - Jika `id` bukan integer positif.
   - **Contoh Response**:
     ```json
     { "message": "ID, nama, atau harga tidak valid" }
     ```

2. **Data Tidak Ditemukan (`404 Not Found`)**:
   - Terjadi saat melakukan `GET`, `PUT`, atau `DELETE` pada `id` yang tidak tersedia di database.
   - **Contoh Response**:
     ```json
     { "message": "Produk tidak ditemukan" }
     ```

3. **Kesalahan Server (`500 Internal Server Error`)**:
   - Terjadi jika terjadi gangguan koneksi database atau error tak terduga.
   - **Contoh Response**:
     ```json
     { "message": "Gagal mengupdate produk" }
     ```

---

## 📸 Laporan Evidence & Bukti Pengujian

### A. Pengujian Dasar Week 9 (In-Memory Storage)
- **GET All Products (200)**:  
  ![GET /products](screenshots/Screenshot%202026-11-01%20095930.png)
- **GET Product by ID (200)**:  
  ![GET /products/1](screenshots/Screenshot%202026-11-01%20100007.png)
- **GET Product Not Found (404)**:  
  ![GET /products/999](screenshots/Screenshot%202026-11-01%20100033.png)
- **POST Create Product (201)**:  
  ![POST /products request](screenshots/Screenshot%202026-11-01%20100121.png)  
  ![POST /products response](screenshots/Screenshot%202026-11-01%20100140.png)

### B. Pengujian CRUD Week 10 (PostgreSQL & Prisma ORM)

| No | Skenario | Method & URL | Input Body | Expected Status |
|---|---|---|---|---|
| 1 | Menampilkan seluruh produk | `GET /products` | - | `200 OK` |
| 2 | Menampilkan produk valid | `GET /products/1` | - | `200 OK` |
| 3 | Mengambil produk tidak ada | `GET /products/999` | - | `404 Not Found` |
| 4 | Validasi ID tidak valid | `GET /products/abc` | - | `400 Bad Request` |
| 5 | Tambah produk baru sukses | `POST /products` | `{"name":"Penghapus","price":2000}` | `201 Created` |
| 6 | Validasi tambah produk kosong | `POST /products` | `{"name":""}` | `400 Bad Request` |
| 7 | Update produk sukses | `PUT /products/1` | `{"name":"Buku Gambar","price":12000}` | `200 OK` |
| 8 | Update produk ID tidak ada | `PUT /products/999` | `{"name":"Buku Gambar","price":12000}` | `404 Not Found` |
| 9 | Hapus produk sukses | `DELETE /products/2` | - | `200 OK` |
| 10 | Hapus produk ID tidak ada | `DELETE /products/999` | - | `404 Not Found` |

### C. Perubahan Database (Before vs After)

- **Sebelum Operasi (Before)**:
```text
Table: Product
+----+--------+-------+
| id | name   | price |
+----+--------+-------+
| 1  | Buku   | 15000 |
| 2  | Pulpen |  5000 |
+----+--------+-------+
```

- **Setelah POST (Tambah Produk id 3: "Penghapus", 2000)**:
```text
Table: Product
+----+-----------+-------+
| id | name      | price |
+----+-----------+-------+
| 1  | Buku      | 15000 |
| 2  | Pulpen    |  5000 |
| 3  | Penghapus |  2000 |
+----+-----------+-------+
```

- **Setelah PUT (Update id 1 menjadi "Buku Gambar", 12000)**:
```text
Table: Product
+----+-------------+-------+
| id | name        | price |
+----+-------------+-------+
| 1  | Buku Gambar | 12000 |
| 2  | Pulpen      |  5000 |
| 3  | Penghapus   |  2000 |
+----+-------------+-------+
```

- **Setelah DELETE (Hapus id 2)**:
```text
Table: Product
+----+-------------+-------+
| id | name        | price |
+----+-------------+-------+
| 1  | Buku Gambar | 12000 |
| 3  | Penghapus   |  2000 |
+----+-------------+-------+
```
*(Anda juga dapat melihat dan mengelola data secara visual melalui GUI dengan menjalankan `npx prisma studio`).*
