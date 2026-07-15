-- VE Cookie Board schema. Apply once in the Supabase SQL editor.

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_key text not null,
  created_at timestamptz not null default now()
);

create table if not exists cookies (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  awarded_at timestamptz not null default now()
);

create index if not exists cookies_member_id_idx on cookies (member_id);

-- RLS: enabled, with open read/write via the anon key.
-- Accepted trade-off: the shared UI password is the only real gate; the
-- database itself trusts any client holding the anon key. Fine for a
-- low-stakes internal fun tool.
alter table members enable row level security;
alter table cookies enable row level security;

create policy "anon read members" on members for select using (true);
create policy "anon write members" on members for all using (true) with check (true);
create policy "anon read cookies" on cookies for select using (true);
create policy "anon write cookies" on cookies for all using (true) with check (true);
