# Tugas Praktikum Pemrograman Web: Express.js & PostgreSQL dengan Prisma ORM

Repositori ini berisi implementasi REST API untuk manajemen data produk yang dikembangkan secara bertahap sesuai materi praktikum:
- **Week 9**: Pengenalan Express.js, arsitektur modular (*Separation of Concerns* antara routing dan controller), dan penyimpanan sementara menggunakan *in-memory array*.
- **Week 10**: Integrasi basis data relasional **PostgreSQL** (*Cloud-hosted via Neon Database*) menggunakan **Prisma ORM** (*Object-Relational Mapping*), migrasi skema basis data (*Prisma Migrate*), operasi CRUD lengkap (*Create, Read, Update, Delete*), penanganan validasi & error, serta visualisasi data melalui *Prisma Studio*.

---

## 🛠️ Teknologi yang Digunakan

- **Runtime & Bahasa**: Node.js (JavaScript CommonJS)
- **Web Framework**: Express.js (v5)
- **ORM (Object-Relational Mapping)**: Prisma ORM (v6)
  - `@prisma/client`: Query builder bertipe untuk berinteraksi dengan database.
  - `prisma`: CLI untuk migrasi dan pengelolaan skema.
- **Database**: PostgreSQL (Cloud Database: Neon.tech)
- **Environment Management**: Dotenv
- **API Testing Client**: Hoppscotch & Postman
- **Database GUI**: Prisma Studio

---

## 📂 Struktur Direktori Proyek

```text
expressjs/
├── controllers/
│   └── productController.js      # Logika bisnis HTTP handler dan pemanggilan Prisma ORM
├── prisma/
│   ├── migrations/               # Riwayat file migrasi SQL basis data
│   │   ├── 20261104072939_init_crud/
│   │   │   └── migration.sql
│   │   ├── 20261104073359_add_product/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma             # Definisi datasource PostgreSQL dan model 'Product'
├── routes/
│   └── productRoutes.js          # Pemetaan route URL dan HTTP methods ke controller
├── screenshots/                  # Bukti pengujian API (Hoppscotch & Postman) dan Prisma Studio
├── .env.example                  # Template konfigurasi environment variable aman
├── .gitignore                    # Pengabaian file sensitif (.env) dan folder dependensi (node_modules)
├── app.js                        # Entry point inisialisasi aplikasi Express.js dan middleware
├── package.json                  # Konfigurasi dependensi dan script npm
├── package-lock.json             # Kunci dependensi
├── seed.js                       # Script pengisian data awal produk ke database
└── README.md                     # Dokumentasi komprehensif proyek
```

---

## ⚙️ Skema Basis Data & Konfigurasi Prisma

Model data didefinisikan pada file `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

### Penjelasan Field Model `Product`:
- `id`: Tipe data `Int`, berfungsi sebagai *Primary Key* unik dengan auto-increment otomatis dari PostgreSQL (`@id @default(autoincrement())`).
- `name`: Tipe data `String`, menyimpan nama produk.
- `price`: Tipe data `Int`, menyimpan harga produk dalam satuan bilangan bulat positif.

---

## 🚀 Panduan Instalasi dan Menjalankan Program

### 1. Kloning Repositori
```bash
git clone https://github.com/SahiraBilqis/pemweb-expressjs-prisma.git
cd pemweb-expressjs-prisma
```

### 2. Instalasi Dependensi
Instal seluruh library yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment Variable (`.env`)
Salin template konfigurasi `.env.example` menjadi file `.env`:
```bash
copy .env.example .env
```
Sesuaikan nilai `DATABASE_URL` dengan connection string PostgreSQL Anda:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
PORT=3000
```
> **Catatan Keamanan**: Sesuai instruksi pada materi praktikum, file `.env` yang memuat kredensial rahasia telah dikecualikan di `.gitignore` dan tidak boleh diunggah ke publik/Git.

### 4. Sinkronisasi Basis Data & Generate Prisma Client
Terapkan migrasi ke database dan buat Prisma Client:
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Pengisian Data Awal (Opsional - Seeding)
Untuk mengisi database dengan data produk awal (Buku & Pulpen), jalankan:
```bash
npm run seed
# atau: node seed.js
```

### 6. Menjalankan Server Express
```bash
npm start
# atau: node app.js
```
Server akan aktif dan siap menerima request di: `http://localhost:3000`.

### 7. Membuka Prisma Studio (GUI Database)
Untuk melihat dan mengelola isi tabel database secara visual di browser:
```bash
npm run prisma:studio
# atau: npx prisma studio
```
Buka antarmuka web di: `http://localhost:5555`.

---

## 📌 Daftar Endpoint REST API

| Method | Endpoint | Deskripsi | Status Sukses | Penanganan Validasi / Error |
|---|---|---|---|---|
| **GET** | `/products` | Mengambil seluruh daftar produk | `200 OK` | `500 Internal Server Error` |
| **GET** | `/products/:id` | Mengambil detail satu produk berdasarkan ID | `200 OK` | `400 Bad Request` / `404 Not Found` |
| **POST** | `/products` | Menambahkan data produk baru | `201 Created` | `400 Bad Request` / `500 Internal Server Error` |
| **PUT** | `/products/:id` / `/products` | Mengupdate data produk yang sudah ada | `200 OK` | `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/products/:id` / `/products` | Menghapus data produk berdasarkan ID | `200 OK` | `400 Bad Request` / `404 Not Found` |

> **Fleksibilitas PUT & DELETE**: Sesuai kebutuhan tugas praktikum, controller mendukung pembacaan `id` baik melalui URL Parameter (`/products/:id`) maupun melalui Request Body (`{ "id": 1, ... }`).

---

## 📝 Contoh Request & Response

### 1. GET Semua Produk
- **URL**: `GET http://localhost:3000/products`
- **Response** (`200 OK`):
```json
[
  {
    "id": 1,
    "name": "Buku Tulis",
    "price": 20000
  },
  {
    "id": 2,
    "name": "Pulpen",
    "price": 5000
  }
]
```

### 2. GET Produk Berdasarkan ID
- **URL**: `GET http://localhost:3000/products/1`
- **Response Sukses** (`200 OK`):
```json
{
  "id": 1,
  "name": "Buku Tulis",
  "price": 20000
}
```
- **Response Produk Tidak Ditemukan** (`404 Not Found` - contoh `GET /products/999`):
```json
{
  "message": "Produk tidak ditemukan"
}
```

### 3. POST Tambah Produk Baru
- **URL**: `POST http://localhost:3000/products`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Pensil",
  "price": 3000
}
```
- **Response Sukses** (`201 Created`):
```json
{
  "id": 3,
  "name": "Pensil",
  "price": 3000
}
```

### 4. PUT Update Produk yang Sudah Ada
- **URL**: `PUT http://localhost:3000/products/3` atau `PUT http://localhost:3000/products`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "id": 3,
  "name": "Pensil 2B",
  "price": 5000
}
```
- **Response Sukses** (`200 OK`):
```json
{
  "id": 3,
  "name": "Pensil 2B",
  "price": 5000
}
```

### 5. DELETE Hapus Produk
- **URL**: `DELETE http://localhost:3000/products/3` atau `DELETE http://localhost:3000/products` (dengan `id` di body)
- **Response Sukses** (`200 OK`):
```json
{
  "message": "Produk berhasil dihapus"
}
```

---

## 🛡️ Skenario Validasi & Penanganan Kesalahan (Error Handling)

1. **400 Bad Request (Kesalahan Input Klien)**:
   - Terjadi jika `id` bukan bilangan bulat positif (misal string atau <= 0).
   - Terjadi jika `name` bukan string atau berupa string kosong.
   - Terjadi jika `price` negatif atau bukan integer.
   - Terjadi jika melakukan `PUT` tanpa menyediakan parameter ID.
   - **Contoh JSON Response**:
     ```json
     {
       "message": "ID, nama, atau harga tidak valid"
     }
     ```

2. **404 Not Found (Data Tidak Ditemukan)**:
   - Terjadi saat melakukan `GET`, `PUT`, atau `DELETE` terhadap produk dengan ID yang tidak tercatat di database (ditangani melalui penangkapan Prisma error code `P2025` atau pengecekan null).
   - **Contoh JSON Response**:
     ```json
     {
       "message": "Produk tidak ditemukan"
     }
     ```

3. **500 Internal Server Error (Kesalahan Internal)**:
   - Ditangani oleh blok `try...catch` pada controller apabila terjadi kendala jaringan database atau kegagalan tak terduga.
   - **Contoh JSON Response**:
     ```json
     {
       "message": "Gagal mengambil produk"
     }
     ```

---

## 📷 Dokumentasi Hasil Pengujian (Evidence Report)

Berikut adalah rekapitulasi bukti pengujian API menggunakan **Hoppscotch** dan **Postman**, serta verifikasi perubahan data secara langsung di basis data PostgreSQL menggunakan **Prisma Studio**.

---

### A. Pengujian Week 9 (In-Memory Array & Postman)

#### 1. GET `/products` (Menampilkan Seluruh Data Produk Awal)
Menampilkan daftar seluruh produk dari memori dengan status `200 OK`.
![GET /products 200](screenshots/Screenshot%202026-11-01%20095930.png)

#### 2. GET `/products/1` (Menampilkan Produk Berdasarkan ID Tertentu)
Menampilkan objek produk Buku dengan status `200 OK`.
![GET /products/1 200](screenshots/Screenshot%202026-11-01%20100007.png)

#### 3. GET `/products/999` (ID Produk Tidak Ditemukan)
Menguji penanganan ketika ID yang diminta tidak ada, menghasilkan status `404 Not Found`.
![GET /products/999 404](screenshots/Screenshot%202026-11-01%20100033.png)

#### 4. POST `/products` (Menambahkan Produk Baru & Auto Increment ID)
Request pengiriman data produk baru `{ "name": "Pensil", "price": 3000 }`:
![POST /products Request](screenshots/Screenshot%202026-11-01%20100121.png)

Response produk berhasil ditambahkan dengan ID baru dan status `201 Created`:
![POST /products Response 201](screenshots/Screenshot%202026-11-01%20100140.png)

---

### B. Pengujian Week 10 (PostgreSQL Neon, Prisma ORM, Hoppscotch & Prisma Studio)

Sesuai instruksi PPT Week 10, berikut adalah bukti pengujian menyeluruh meliputi skenario **Success**, **Kesalahan Validasi**, dan **Perubahan Data pada Database (Before - After)**.

#### 1. Kondisi Database Awal di Prisma Studio (Before Update & Delete)
Tampilan GUI Prisma Studio (`http://localhost:5555`) pada tabel `Product` sebelum operasi update dan delete dijalankan. Terlihat 2 record aktif:
- `id: 1` | `name: Buku Tulis` | `price: 20000`
- `id: 3` | `name: Pensil` | `price: 3000`

![Prisma Studio Before Update](screenshots/Screenshot%202026-11-06%20165241.png)

---

#### 2. Uji Kesalahan Validasi: Update (PUT) Tanpa Menyertakan ID
Pengujian pengiriman request `PUT http://localhost:3000/products` tanpa menyertakan ID pada URL maupun body request:
- **Request Body**: `{"name": "Pensil 2B", "price": 5000}`
- **Hasil**: Server menolak dengan kode status `400 Bad Request` dan pesan `"ID, nama, atau harga tidak valid"`.

![Hoppscotch PUT 400 Missing ID](screenshots/Screenshot%202026-11-06%20165327.png)

---

#### 3. Uji Kesalahan Validasi: Update (PUT) dengan Data Tidak Valid
Pengujian pengiriman data yang tidak memenuhi kriteria validasi:
- **Request Body**: `{"name": "", "price": -1000}` (nama berupa string kosong dan harga negatif)
- **Hasil**: Server mendeteksi ketidakvalidan data dan merespons dengan status `400 Bad Request` serta pesan `"ID, nama, atau harga tidak valid"`.

![Hoppscotch PUT 400 Invalid Data](screenshots/Screenshot%202026-11-06%20165509.png)

---

#### 4. Uji Sukses: Update (PUT) Produk Berdasarkan ID
Pengujian memperbarui data produk yang ada di PostgreSQL Neon:
- **Request**: `PUT http://localhost:3000/products/3`
- **Request Body**: `{"name": "Pensil 2B", "price": 5000}`
- **Hasil**: Data produk ID 3 berhasil diperbarui dengan nama `"Pensil 2B"` dan harga `5000`. Server mengembalikan status `200 OK`.

![Hoppscotch PUT 200 OK](screenshots/Screenshot%202026-11-06%20165626.png)

---

#### 5. Kondisi Database di Prisma Studio Setelah Update (After PUT)
Bukti verifikasi langsung pada basis data PostgreSQL Neon melalui Prisma Studio. Terlihat perubahan nyata pada baris `id: 3` yang telah berubah dari `"Pensil"` menjadi `"Pensil 2B"` dengan harga `5000`:

![Prisma Studio After PUT](screenshots/Screenshot%202026-11-06%20165637.png)

---

#### 6. Uji Sukses: Hapus (DELETE) Produk Berdasarkan ID
Pengujian penghapusan record data dari PostgreSQL:
- **Request**: `DELETE http://localhost:3000/products` (dengan menyertakan `id: 3`)
- **Hasil**: Record berhasil dihapus dari tabel basis data. Server mengembalikan status `200 OK` dengan pesan `"Produk berhasil dihapus"`.

![Hoppscotch DELETE 200 OK](screenshots/Screenshot%202026-11-06%20165702.png)

---

#### 7. Kondisi Database di Prisma Studio Setelah Hapus (After DELETE)
Bukti verifikasi langsung pada basis data PostgreSQL Neon melalui Prisma Studio setelah eksekusi DELETE. Record dengan `id: 3` telah terhapus secara permanen dari database, menyisakan 1 baris data (`id: 1`):

![Prisma Studio After DELETE](screenshots/Screenshot%202026-11-06%20165712.png)

---

### C. Catatan Bukti Pengujian Tambahan di Folder `screenshots/`
Selain pengujian di atas, folder `screenshots/` juga memuat bukti hasil pengujian modul terkait yang menunjukkan skenario lanjutan seperti pengujian `PATCH`, penanganan konflik duplikasi data (`409 Conflict`), verifikasi `DELETE` pada data yang tidak ditemukan (`404 Not Found`), serta log eksekusi terminal server.
