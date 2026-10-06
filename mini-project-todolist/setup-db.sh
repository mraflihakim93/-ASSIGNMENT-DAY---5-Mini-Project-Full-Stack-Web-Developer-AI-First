#!/usr/bin/env bash
# ============================================================
# setup-db.sh — Muat schema.sql + seed.sql ke MySQL
# Jalankan dari folder project:  bash setup-db.sh
# ============================================================

set -e

MYSQL_BIN="/usr/local/mysql/bin/mysql"
SOCKET="/tmp/mysql.sock"
DB_USER="${DB_USER:-root}"
DB_NAME="todo_list"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Memuat schema.sql..."
"$MYSQL_BIN" -u "$DB_USER" -p --socket="$SOCKET" < "$SCRIPT_DIR/database/schema.sql"

echo "==> Memuat seed.sql..."
"$MYSQL_BIN" -u "$DB_USER" -p --socket="$SOCKET" < "$SCRIPT_DIR/database/seed.sql"

echo "==> Verifikasi data:"
"$MYSQL_BIN" -u "$DB_USER" -p --socket="$SOCKET" -e \
  "USE $DB_NAME; SELECT id, code, title, duration FROM tasks; SELECT COUNT(*) AS total_checklists FROM checklists;"

echo "==> Selesai. Database '$DB_NAME' siap."
