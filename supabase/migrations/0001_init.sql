-- Andrea's Fashion Hair – Datenbankschema (Supabase/Postgres)
-- STATUS: vorbereitet, NICHT verdrahtet. Die Website nutzt derzeit nur den In-Memory-Demo-Store
-- (src/server/store-memory.ts). Wer Supabase anschließt, implementiert src/server/store.ts dagegen.
-- Abgeleitet aus dem Export (0000_export_d1_reference.sql), verbessert:
--   * Doppelverkauf-Schutz in der Datenbank (Primärschlüssel auf dem Einzelstück in piece_reservations)
--   * Bestellung + Reservierung atomar in einer Funktion (place_order)
--   * Status als Enum, Zeitstempel mit Zeitzone, Idempotenzschlüssel, Hash des Zugangscodes
--   * IP nur als Hash, Löschfristen-Felder
--   * RLS an, keine Policies: nur der Service-Role-Key (serverseitig) hat Zugriff

create extension if not exists pgcrypto;

create type order_status as enum ('eingegangen', 'bestaetigt', 'versendet', 'storniert');
create type mail_status as enum ('gesendet', 'fehlgeschlagen', 'nicht_konfiguriert');
create type inquiry_topic as enum ('beratung', 'extensions', 'massanfertigung', 'salon', 'bestellung');

create table orders (
  id text primary key check (id ~ '^AF-[A-Z0-9]{6}$'),
  token_hash text not null,
  idempotency_key uuid not null unique,
  created_at timestamptz not null default now(),
  locale text not null default 'de',
  status order_status not null default 'eingegangen',
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  email text not null check (char_length(email) <= 160),
  phone text not null default '' check (char_length(phone) <= 40),
  street text not null check (char_length(street) <= 160),
  postal_code text not null check (char_length(postal_code) <= 12),
  city text not null check (char_length(city) <= 120),
  country char(2) not null,
  note text not null default '' check (char_length(note) <= 800),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null check (shipping_cents >= 0),
  total_cents integer not null check (total_cents = subtotal_cents + shipping_cents),
  mail_customer mail_status not null default 'nicht_konfiguriert',
  mail_owner mail_status not null default 'nicht_konfiguriert',
  -- Handels-/Steuerrecht: Aufbewahrung i. d. R. 10 Jahre ab Jahresende; danach löschen
  delete_after date not null default (date_trunc('year', now()) + interval '11 years')::date
);

create table order_items (
  id bigint generated always as identity primary key,
  order_id text not null references orders (id) on delete cascade,
  product_id integer not null,
  slug text not null,
  name text not null,
  unit_cents integer not null check (unit_cents >= 0),
  quantity integer not null check (quantity between 1 and 9),
  is_unique boolean not null,
  check (not is_unique or quantity = 1)
);
create index order_items_order_idx on order_items (order_id);

-- Ein Einzelstück kann nur EINMAL reserviert sein (Primärschlüssel = Doppelverkauf-Schutz)
create table piece_reservations (
  slug text primary key,
  order_id text not null references orders (id) on delete cascade,
  reserved_at timestamptz not null default now()
);

create table inquiries (
  id text primary key,
  created_at timestamptz not null default now(),
  topic inquiry_topic not null,
  name text not null,
  email text not null,
  phone text not null default '',
  product text not null default '',
  message text not null check (char_length(message) <= 1600),
  delete_after date not null default (now() + interval '2 years')::date
);

create table withdrawals (
  id text primary key,
  received_at timestamptz not null default now(),
  name text not null,
  email text not null,
  order_number text not null,
  order_date text not null default '',
  items text not null default '',
  delete_after date not null default (now() + interval '4 years')::date
);

create table newsletter_subscribers (
  email text primary key,
  token_hash text not null,
  requested_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  -- Unbestätigte Anmeldungen nach 30 Tagen löschen
  delete_after date
);

create table rate_limits (
  key text not null,           -- z. B. 'order:' || HMAC(IP)
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (key, window_start)
);

alter table orders enable row level security;
alter table order_items enable row level security;
alter table piece_reservations enable row level security;
alter table inquiries enable row level security;
alter table withdrawals enable row level security;
alter table newsletter_subscribers enable row level security;
alter table rate_limits enable row level security;
-- Keine Policies: anon/authenticated haben keinerlei Zugriff. Nur service_role (umgeht RLS).
revoke all on all tables in schema public from anon, authenticated;

-- Bestellung atomar anlegen: alles oder nichts.
-- p_order: { id, token_hash, idempotency_key, locale, customer_*, subtotal_cents, shipping_cents, total_cents }
-- p_items: [{ product_id, slug, name, unit_cents, quantity, is_unique }]
create or replace function place_order(p_order jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing text;
  taken text[];
begin
  select id into existing from orders where idempotency_key = (p_order->>'idempotency_key')::uuid;
  if existing is not null then
    return jsonb_build_object('ok', true, 'duplicate', true, 'id', existing);
  end if;

  insert into orders (id, token_hash, idempotency_key, locale, customer_name, email, phone, street, postal_code, city, country, note, subtotal_cents, shipping_cents, total_cents)
  values (p_order->>'id', p_order->>'token_hash', (p_order->>'idempotency_key')::uuid, p_order->>'locale', p_order->>'customer_name', p_order->>'email',
          coalesce(p_order->>'phone', ''), p_order->>'street', p_order->>'postal_code', p_order->>'city', p_order->>'country', coalesce(p_order->>'note', ''),
          (p_order->>'subtotal_cents')::int, (p_order->>'shipping_cents')::int, (p_order->>'total_cents')::int);

  insert into order_items (order_id, product_id, slug, name, unit_cents, quantity, is_unique)
  select p_order->>'id', (i->>'product_id')::int, i->>'slug', i->>'name', (i->>'unit_cents')::int, (i->>'quantity')::int, (i->>'is_unique')::boolean
  from jsonb_array_elements(p_items) i;

  begin
    insert into piece_reservations (slug, order_id)
    select i->>'slug', p_order->>'id' from jsonb_array_elements(p_items) i where (i->>'is_unique')::boolean;
  exception when unique_violation then
    select array_agg(r.slug) into taken
    from piece_reservations r
    where r.slug in (select i->>'slug' from jsonb_array_elements(p_items) i where (i->>'is_unique')::boolean);
    raise exception 'sold:%', array_to_string(taken, ',') using errcode = 'P0001';
  end;

  return jsonb_build_object('ok', true, 'duplicate', false, 'id', p_order->>'id');
end;
$$;
revoke all on function place_order(jsonb, jsonb) from public, anon, authenticated;

-- Stornieren gibt Einzelstücke frei
create or replace function cancel_order(p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update orders set status = 'storniert' where id = p_id;
  delete from piece_reservations where order_id = p_id;
  return found;
end;
$$;
revoke all on function cancel_order(text) from public, anon, authenticated;

-- Fester Fensterzähler: true = erlaubt
create or replace function hit_rate_limit(p_key text, p_window_seconds int, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  n int;
begin
  insert into rate_limits (key, window_start) values (p_key, w)
  on conflict (key, window_start) do update set hits = rate_limits.hits + 1
  returning hits into n;
  delete from rate_limits where window_start < now() - interval '1 day';
  return n <= p_limit;
end;
$$;
revoke all on function hit_rate_limit(text, int, int) from public, anon, authenticated;
