-- ============================================================
-- Hello World To-Do List — Seed Data
-- Engine : MySQL 8.x
-- File   : database/seed.sql
-- Isi    : INSERT query untuk mengisi tabel tasks & checklists.
-- Jalankan SETELAH schema.sql.
-- ============================================================

USE todo_list;

-- Bersihkan data lama agar file ini bisa dijalankan berulang.
-- (Urutan penting: checklists dulu karena ada foreign key.)
DELETE FROM checklists;
DELETE FROM tasks;
ALTER TABLE tasks AUTO_INCREMENT = 1;
ALTER TABLE checklists AUTO_INCREMENT = 1;

-- ------------------------------------------------------------
-- INSERT ke tabel tasks
-- ------------------------------------------------------------
INSERT INTO tasks
  (code, title, subtitle, description, priority, status, duration, tags, image_url, is_published)
VALUES
  (
    'belajar-html-dasar',
    'Belajar HTML Dasar',
    'Membangun Struktur Halaman',
    'Mengenal elemen semantik HTML seperti header, main, section, dan footer. Latihan membuat halaman statis pertama dengan struktur yang rapi dan mudah dibaca.',
    'high',
    'done',
    45,
    JSON_ARRAY('HTML', 'Semantic', 'Struktur'),
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    1
  ),
  (
    'styling-css-responsive',
    'Styling CSS Responsive',
    'Layout Modern dengan Grid & Flexbox',
    'Menggunakan CSS Grid dan Flexbox untuk membuat layout dua kolom yang responsif. Ditambah media query agar tampilan rapi di desktop maupun mobile.',
    'high',
    'in_progress',
    60,
    JSON_ARRAY('CSS', 'Grid', 'Flexbox', 'Responsive'),
    'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    1
  ),
  (
    'javascript-dom-interaktif',
    'JavaScript DOM Interaktif',
    'State & Event Handling',
    'Membuat interaksi halaman dengan vanilla JavaScript: menangani klik, mengelola state, dan memperbarui DOM tanpa reload. Pola UI State Machine sederhana.',
    'high',
    'todo',
    90,
    JSON_ARRAY('JavaScript', 'DOM', 'Event', 'State'),
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
    1
  ),
  (
    'fetch-api-response',
    'Konsumsi API dengan fetch',
    'Ambil Data dari Backend',
    'Mengambil data dari endpoint API menggunakan fetch(), menangani loading state, error, dan menampilkan hasil response ke halaman secara dinamis.',
    'medium',
    'todo',
    75,
    JSON_ARRAY('JavaScript', 'API', 'fetch', 'JSON'),
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    1
  ),
  (
    'database-mysql-query',
    'Query Database MySQL',
    'CREATE TABLE & INSERT',
    'Merancang tabel, menulis query CREATE TABLE, dan mengisi data dengan INSERT. Memahami primary key, foreign key, dan tipe data dasar.',
    'medium',
    'todo',
    120,
    JSON_ARRAY('SQL', 'MySQL', 'Database'),
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    1
  );
-- Catatan: code 'belajar-html-dasar' dipakai HARDCODE di halaman Product 1.
--          code 'styling-css-responsive' dipakai sebagai contoh Product 2 (dari API).

-- ------------------------------------------------------------
-- INSERT ke tabel checklists (sub-langkah tiap task)
-- task_id mengacu ke id yang baru dibuat di atas (1..5).
-- ------------------------------------------------------------
INSERT INTO checklists (task_id, label, is_done, sort_order) VALUES
  (1, 'Pahami struktur dasar dokumen HTML5',            1, 1),
  (1, 'Latihan membuat heading dan paragraf',            1, 2),
  (1, 'Gunakan elemen semantik header/main/footer',      1, 3),

  (2, 'Setup variabel warna dan tipografi di :root',     1, 1),
  (2, 'Buat layout dua kolom dengan CSS Grid',           1, 2),
  (2, 'Tambahkan media query untuk mobile',              0, 3),
  (2, 'Uji tampilan di viewport 375px',                  0, 4),

  (3, 'Ambil elemen DOM dengan querySelector',           0, 1),
  (3, 'Buat objek state dan fungsi render',              0, 2),
  (3, 'Pasang event listener pada tombol',               0, 3),

  (4, 'Panggil fetch ke endpoint API',                   0, 1),
  (4, 'Tangani response JSON',                           0, 2),
  (4, 'Tampilkan error bila gagal memuat',               0, 3),

  (5, 'Tulis CREATE DATABASE dan CREATE TABLE',          0, 1),
  (5, 'Tentukan primary key dan foreign key',            0, 2),
  (5, 'Tulis INSERT untuk mengisi data',                 0, 3);
