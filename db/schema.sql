CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  preferred_contact TEXT,
  business_category TEXT,
  preferred_floor TEXT,
  preferred_unit TEXT,
  required_area TEXT,
  occupation_date TEXT,
  lease_duration TEXT,
  site_visit_interest TEXT,
  requirements TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  assigned_agent TEXT,
  next_follow_up TEXT,
  outcome TEXT,
  page_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  pricing_unlocked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_unit ON leads (preferred_unit);

CREATE TABLE IF NOT EXISTS site_visits (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  preferred_date TEXT,
  preferred_time TEXT,
  visitors TEXT,
  unit_interest TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Requested',
  FOREIGN KEY (lead_id) REFERENCES leads (id)
);
CREATE INDEX IF NOT EXISTS idx_site_visits_lead ON site_visits (lead_id);

CREATE TABLE IF NOT EXISTS lead_notes (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  author TEXT,
  note TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads (id)
);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes (lead_id);

CREATE TABLE IF NOT EXISTS lead_events (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  created_at TEXT NOT NULL,
  event TEXT NOT NULL,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_lead_events_created ON lead_events (created_at DESC);
