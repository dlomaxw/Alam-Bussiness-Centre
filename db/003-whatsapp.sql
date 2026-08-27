CREATE TABLE IF NOT EXISTS whatsapp_enquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  -- 'click' is someone tapping through from the website; 'message' is a real
  -- inbound WhatsApp message received through the Cloud API webhook.
  direction TEXT NOT NULL,
  lead_id TEXT,
  phone TEXT,
  contact_name TEXT,
  message TEXT,
  unit_slug TEXT,
  floor TEXT,
  placement TEXT,
  page_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  wa_message_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'New',
  ip_hash TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_wa_created ON whatsapp_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_lead ON whatsapp_enquiries (lead_id);
CREATE INDEX IF NOT EXISTS idx_wa_phone ON whatsapp_enquiries (phone);
CREATE INDEX IF NOT EXISTS idx_wa_status ON whatsapp_enquiries (status);
