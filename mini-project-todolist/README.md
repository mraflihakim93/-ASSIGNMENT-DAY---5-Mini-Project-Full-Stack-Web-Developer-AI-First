# Hello World To-Do List — Mini Project Fullstack Web Development

Mini project lanjutan dari practical session. Aplikasi web To-Do List dengan **2 halaman Detail Product**:

| Halaman | Sumber Konten | Teknologi |
|---|---|---|
| `frontend/product-1.html` | **Hardcode** (ditulis di `product-1.js`) | HTML, CSS, Vanilla JS |
| `frontend/product-2.html` | **Otomatis dari response API** (`GET /api/tasks/:code`) | HTML, CSS, Vanilla JS + fetch |

Ditambah fitur **autentikasi publik**: halaman **Register**, **Login**, dan **Dashboard** terproteksi (bcrypt + JWT).

Backend: **Node.js + Express**. Database: **MySQL**.

---

## 1. Struktur Folder

```
mini-project-todolist/
├── frontend/                     # FRONT END (JavaScript)
│   ├── index.html                # Beranda + navigasi
│   ├── product-1.html            # Detail Product 1 — hardcode
│   ├── product-2.html            # Detail Product 2 — dari API
│   ├── login.html                # Halaman login publik
│   ├── register.html             # Halaman register publik
│   ├── dashboard.html            # Halaman terproteksi setelah login
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── config.js
│       ├── product-1.js
│       └── product-2.js
├── backend/                      # BACK END (JavaScript)
│   ├── src/
│   │   ├── server.js             # Entry point Express
│   │   ├── db.js                 # Koneksi MySQL (pool)
│   │   ├── middleware/
│   │   │   └── auth.js           # Verifikasi JWT (requireAuth)
│   │   └── routes/
│   │       ├── tasks.js          # Endpoint API task
│   │       └── auth.js           # Endpoint register/login/me
│   ├── package.json
│   ├── .env.example              # contoh konfigurasi
│   └── .gitignore
├── database/                     # DATABASE (SQL)
│   ├── schema.sql                # CREATE DATABASE + CREATE TABLE
│   └── seed.sql                  # INSERT query (isi data)
├── links.txt                     # link GitHub & LinkedIn
└── README.md
```

---

## 2. Cara Menjalankan

### Prasyarat
- Node.js v18+
- MySQL 8+ (berjalan di `127.0.0.1:3306`)

### Langkah A — Siapkan Database
Jalankan kedua file SQL lewat terminal:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Atau buka MySQL Workbench, lalu jalankan isi `schema.sql` kemudian `seed.sql`.

### Langkah B — Konfigurasi Backend
```bash
cd backend
cp .env.example .env
```
Buka `.env` dan sesuaikan `DB_USER` / `DB_PASSWORD` dengan akun MySQL Anda.

### Langkah C — Install & Jalankan
```bash
npm install
npm start
```
Server berjalan di `http://localhost:3000`.

### Langkah D — Buka Aplikasi
- Product 1 (hardcode): `http://localhost:3000/product-1.html`
- Product 2 (API):      `http://localhost:3000/product-2.html`
- Cek API:              `http://localhost:3000/api/tasks`

> Frontend disajikan langsung oleh Express, jadi tidak perlu server terpisah dan tidak ada masalah CORS.

---

## 3. Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/health` | Cek status server + database |
| GET | `/api/tasks` | Ambil semua task terpublikasi |
| GET | `/api/tasks/:code` | Ambil satu task + checklist (dipakai Product 2) |
| POST | `/api/auth/register` | Daftar akun baru → kembalikan JWT |
| POST | `/api/auth/login` | Login → kembalikan JWT |
| GET | `/api/auth/me` | Profil user (butuh `Authorization: Bearer <token>`) |

Contoh response `GET /api/tasks/styling-css-responsive`:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "code": "styling-css-responsive",
    "title": "Styling CSS Responsive",
    "subtitle": "Layout Modern dengan Grid & Flexbox",
    "description": "Menggunakan CSS Grid dan Flexbox ...",
    "priority": "high",
    "status": "in_progress",
    "duration": 60,
    "tags": ["CSS", "Grid", "Flexbox", "Responsive"],
    "image_url": "https://images.unsplash.com/...",
    "checklists": [
      { "id": 4, "label": "Setup variabel warna dan tipografi di :root", "is_done": 1, "sort_order": 1 }
    ]
  }
}
```

---

## 4. Fitur Halaman Detail

Kedua halaman berbagi pola interaksi yang sama (UI State Machine sederhana):

1. Pilih langkah pengerjaan (checklist) → menandai langkah aktif.
2. Atur jumlah sesi dengan tombol `+` / `−` (rentang 1–5).
3. Ringkasan menampilkan langkah, jumlah sesi, dan total durasi secara langsung.
4. Tombol konfirmasi hanya aktif setelah langkah dipilih.
5. Pesan konfirmasi tampil inline dan otomatis hilang bila pilihan berubah.

Perbedaan utama:
- **Product 1**: data diambil dari konstanta `TASK` di `product-1.js`.
- **Product 2**: data diambil dengan `fetch()` dari API, lengkap dengan state **loading**, **error + tombol retry**, dan rendering checklist dari array response.

---

## 5. Teknologi

- HTML5 semantik
- CSS3 (Grid, Flexbox, custom properties, media query)
- Vanilla JavaScript (DOM, event handling, state, `fetch`, async/await)
- Node.js + Express
- MySQL (`mysql2`)

---

## 6. Catatan Keamanan

- File `.env` berisi password database dan **tidak boleh** di-commit (sudah masuk `.gitignore`).
- Untuk produksi, gunakan user MySQL dengan hak akses terbatas (hanya database `todo_list`), bukan `root`.

---

## 7. Fitur Autentikasi (Login, Register, Dashboard)

### Halaman publik
- **Register** (`register.html`): nama, email, password (min. 6 karakter).
- **Login** (`login.html`): email + password, dengan toggle lihat password.
- **Dashboard** (`dashboard.html`): hanya bisa dibuka jika punya token valid.

### Alur keamanan
1. Password di-hash memakai **bcrypt** (`bcryptjs`, 10 salt rounds) sebelum disimpan ke MySQL.
   Kolom database menyimpan `$2b$10$...`, **bukan** password asli.
2. Saat login/register berhasil, server menandatangani **JWT** (berlaku 2 jam) dan mengirimnya ke browser.
3. Browser menyimpan token di `localStorage` dan mengirimnya via header
   `Authorization: Bearer <token>` untuk mengakses route terproteksi.
4. Middleware `requireAuth` menolak request tanpa/`token` tidak valid dengan **HTTP 401**.
5. `/api/auth/me` memvalidasi token **di sisi server**, sehingga dashboard tidak bisa
   diakses hanya dengan memalsukan halaman.

### Cara mencoba
1. Buka `http://localhost:3000/register.html`, daftar akun baru.
2. Otomatis diarahkan ke `dashboard.html` dan melihat profil Anda.
3. Klik **Keluar** untuk logout (token dihapus).
4. Coba buka `http://localhost:3000/dashboard.html` tanpa login → otomatis dibelokkan ke `login.html`.

---

© 2026 Muhammad Rafli Hakim — Mini Project Fullstack Web Development.
