-- D1 schema for the Zyra Root Beer Rush waitlist.
--
-- Create the database once:
--   npx wrangler d1 create zyra_subscribers
-- Copy the printed database_id into wrangler.toml, then apply this schema:
--   npx wrangler d1 execute zyra_subscribers --remote --file=./db/schema.sql
-- (drop --remote to seed the local dev database used by `wrangler pages dev`)

CREATE TABLE IF NOT EXISTS subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,          -- stored lowercased and trimmed
  source     TEXT,                          -- which form submitted it (hero / band)
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at);
