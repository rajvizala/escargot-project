-- Escargot Remix — Turso/SQLite Schema
-- Run this against your Turso database: turso db shell escargot-remix < schema.sql

CREATE TABLE IF NOT EXISTS remix_history (
  id         TEXT PRIMARY KEY,
  card_id    TEXT    NOT NULL,
  prompt     TEXT    NOT NULL,
  result_b64 TEXT    NOT NULL,
  created_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS card_views (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id   TEXT    NOT NULL,
  viewed_at TEXT    NOT NULL
);

-- Index for querying views by card
CREATE INDEX IF NOT EXISTS idx_card_views_card_id ON card_views(card_id);
