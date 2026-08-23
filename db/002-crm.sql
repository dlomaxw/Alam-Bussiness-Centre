CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (lower(email));

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log (created_at DESC);

CREATE TABLE IF NOT EXISTS unit_overrides (
  slug TEXT PRIMARY KEY,
  status TEXT,
  promo_label TEXT,
  display_priority INTEGER,
  rent_note TEXT,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);
