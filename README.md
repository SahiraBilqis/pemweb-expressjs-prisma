## Cara Menjalankan

1. Buka terminal di folder proyek.
2. Jalankan `npm.cmd install`.
3. Jalankan `node app.js`.
4. Server berjalan di http://localhost:3000.

## Daftar Endpoint

- GET /products → Menampilkan semua produk (200)
![alt text](screenshots/Screenshot%202026-11-01%20095930.png)
- GET /products/:id → Menampilkan produk berdasarkan ID (200)
![alt text](screenshots/Screenshot%202026-11-01%20100007.png)
- GET /products/999 → Produk tidak ditemukan (404)
![alt text](screenshots/Screenshot%202026-11-01%20100033.png)
- POST /products → Menambahkan produk baru (201)
![alt text](screenshots/Screenshot%202026-11-01%20100121.png)
![alt text](screenshots/Screenshot%202026-11-01%20100140.png)

## Contoh Body POST

{ "name": "Pensil", "price": 3000 }
