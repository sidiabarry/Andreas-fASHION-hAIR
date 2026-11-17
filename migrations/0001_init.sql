CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  street TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Deutschland',
  payment TEXT NOT NULL DEFAULT 'paypal',
  note TEXT,
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'neu'
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  unit_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_slug ON order_items (slug);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  topic TEXT NOT NULL,
  product TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'neu'
);

CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);
