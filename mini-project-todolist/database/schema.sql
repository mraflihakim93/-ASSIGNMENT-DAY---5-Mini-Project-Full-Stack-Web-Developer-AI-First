-- ============================================================
-- Hello World To-Do List — Database Schema
-- Engine : MySQL 8.x
-- File   : database/schema.sql
-- Isi    : CREATE DATABASE, CREATE TABLE, dan data master.
-- Jalankan file ini lebih dulu, lalu seed.sql.
-- ============================================================

CREATE DATABASE IF NOT EXISTS todo_list
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE todo_list;

-- ------------------------------------------------------------
-- Tabel: tasks
-- Setiap baris merepresentasikan satu "activity item" pada
-- halaman Detail Product (Product 1 hardcode, Product 2 dari API).
-- Kolom sengaja dibuat lengkap agar bisa dipakai di kedua halaman.
-- ------------------------------------------------------------
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  code          VARCHAR(50)     NOT NULL,               -- slug unik, contoh: "belajar-html"
  title         VARCHAR(150)    NOT NULL,               -- judul aktivitas
  subtitle      VARCHAR(150)    NOT NULL DEFAULT '',    -- sub-judul / kategori tampil
  description   TEXT            NOT NULL,               -- deskripsi panjang
  priority      ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  status        ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  duration      INT UNSIGNED    NOT NULL DEFAULT 30,    -- estimasi durasi (menit) => "harga"/satuan
  tags          JSON            NOT NULL,               -- array tag teknologi
  image_url     VARCHAR(500)    NOT NULL DEFAULT '',
  is_published  TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tasks_code (code),
  KEY idx_tasks_status (status),
  KEY idx_tasks_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabel: users
-- Menyimpan akun pengguna untuk fitur Login & Register.
-- Kolom `password_hash` menyimpan hasil hash bcrypt (bukan
-- password asli) agar aman jika database bocor.
-- ------------------------------------------------------------
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabel: checklists
-- Sub-item (langkah-langkah) milik sebuah task.
-- Relasi 1 task : banyak checklist (foreign key).
-- ------------------------------------------------------------
DROP TABLE IF EXISTS checklists;

CREATE TABLE checklists (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id    INT UNSIGNED NOT NULL,
  label      VARCHAR(200) NOT NULL,
  is_done    TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_checklists_task (task_id),
  CONSTRAINT fk_checklists_task
    FOREIGN KEY (task_id) REFERENCES tasks (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
