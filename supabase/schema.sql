-- Command Center database schema (v1). Run on a fresh Supabase project in the SQL editor.
-- Includes the onboarding additions (expenses.category, orgs.estimated_revenue_cents).

-- =====================================================================
-- Command Center · v1 schema (fresh database)
-- Paste into the SQL editor of a NEW Supabase project and run once.
--
-- Conventions
--   • Every table: id uuid pk, org_id → orgs, created_at
--   • Money is integer cents. Derived values (floor, MRR, overdue,
--     days in stage) are computed, never stored.
--   • Child rows reference parents by (id, org_id), so the database
--     itself guarantees a row can never point at another org's data.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1 · Tenancy
-- ---------------------------------------------------------------------

create table public.orgs (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  name                    text not null,
  business_type           text,
  currency                text not null default 'USD',
  timezone                text not null default 'America/New_York',
  tax_reserve_rate        numeric(4,3) not null default 0.25
                            check (tax_reserve_rate >= 0 and tax_reserve_rate < 1),
  onboarding_step         smallint not null default 1
                            check (onboarding_step between 1 and 4),
  onboarding_completed_at timestamptz
);

create table public.members (
  id         uuid primary key references auth.users(id) on delete cascade,
  org_id     uuid not null references public.orgs(id) on delete cascade,
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name  text not null,
  email      text,
  phone      text,
  role       text not null default 'owner' check (role in ('owner'))
);
create index members_org_id_idx on public.members (org_id);

-- Resolves the caller's org once per statement. security definer so it
-- can read members without tripping members' own RLS policy.
create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.members where id = auth.uid()
$$;

-- ---------------------------------------------------------------------
-- 2 · Floor inputs
-- ---------------------------------------------------------------------

create table public.expenses (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.orgs(id) on delete cascade,
  created_at   timestamptz not null default now(),
  scope        text not null check (scope in ('personal', 'business')),
  label        text not null,
  amount_cents integer not null check (amount_cents >= 0)
);
create index expenses_org_id_idx on public.expenses (org_id);

-- ---------------------------------------------------------------------
-- 3 · Sources (where business comes from)
-- ---------------------------------------------------------------------

create table public.sources (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs(id) on delete cascade,
  created_at timestamptz not null default now(),
  name       text not null,
  channel    text not null default 'other'
               check (channel in ('referral', 'ppc', 'email', 'event', 'social', 'other')),
  cost_cents integer not null default 0 check (cost_cents >= 0),
  started_on date,
  ended_on   date,
  unique (id, org_id),
  check (ended_on is null or started_on is null or ended_on >= started_on)
);
create index sources_org_id_idx on public.sources (org_id);

-- ---------------------------------------------------------------------
-- 4 · Clients and everything hanging off them
-- ---------------------------------------------------------------------

create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs(id) on delete cascade,
  created_at timestamptz not null default now(),
  name       text not null,
  website    text,
  status     text not null default 'active'
               check (status in ('active', 'onboarding', 'paused', 'ended')),
  source_id  uuid,
  signed_on  date not null default current_date,
  notes      text,
  unique (id, org_id),
  foreign key (source_id, org_id) references public.sources (id, org_id)
    on delete set null (source_id)
);
create index clients_org_id_idx    on public.clients (org_id);
create index clients_source_id_idx on public.clients (source_id);

create table public.contacts (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null,
  client_id  uuid not null,
  created_at timestamptz not null default now(),
  name       text not null,
  role       text,
  email      text,
  phone      text,
  is_primary boolean not null default false,
  foreign key (client_id, org_id) references public.clients (id, org_id) on delete cascade
);
create index contacts_org_id_idx    on public.contacts (org_id);
create index contacts_client_id_idx on public.contacts (client_id);
-- At most one primary contact per client.
create unique index contacts_one_primary_idx
  on public.contacts (client_id) where is_primary;

create table public.client_services (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null,
  client_id       uuid not null,
  created_at      timestamptz not null default now(),
  name            text not null,
  amount_cents    integer not null check (amount_cents >= 0),   -- one payment
  interval_months smallint not null default 1
                    check (interval_months between 1 and 24),   -- 1 monthly, 3 quarterly, 12 yearly
  billing_day     smallint check (billing_day between 1 and 31),
  started_on      date not null default current_date,           -- anchors the cycle
  ended_on        date,
  unique (id, org_id),
  foreign key (client_id, org_id) references public.clients (id, org_id) on delete cascade,
  check (ended_on is null or ended_on >= started_on)
);
create index client_services_org_id_idx    on public.client_services (org_id);
create index client_services_client_id_idx on public.client_services (client_id);

create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null,
  client_id    uuid not null,
  service_id   uuid,                                   -- null = one-off
  created_at   timestamptz not null default now(),
  amount_cents integer not null check (amount_cents >= 0),
  due_on       date not null,
  paid_on      date,                                   -- null = unpaid
  foreign key (client_id, org_id)  references public.clients (id, org_id) on delete cascade,
  foreign key (service_id, org_id) references public.client_services (id, org_id)
    on delete set null (service_id),
  -- Generating expected payments twice for the same cycle is a no-op.
  unique (service_id, due_on)
);
create index payments_org_id_idx     on public.payments (org_id);
create index payments_client_id_idx  on public.payments (client_id);
create index payments_due_on_idx     on public.payments (org_id, due_on);

create table public.files (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null,
  client_id    uuid not null,
  created_at   timestamptz not null default now(),
  name         text not null,
  storage_path text not null unique,                   -- "<org_id>/<client_id>/<uuid>-<name>"
  mime_type    text,
  size_bytes   bigint check (size_bytes >= 0),
  foreign key (client_id, org_id) references public.clients (id, org_id) on delete cascade
);
create index files_org_id_idx    on public.files (org_id);
create index files_client_id_idx on public.files (client_id);

-- ---------------------------------------------------------------------
-- 5 · Leads
-- ---------------------------------------------------------------------

create table public.leads (
  id                      uuid primary key default gen_random_uuid(),
  org_id                  uuid not null references public.orgs(id) on delete cascade,
  created_at              timestamptz not null default now(),
  name                    text not null,
  contact_name            text,
  email                   text,
  phone                   text,
  stage                   text not null default 'new'
                            check (stage in ('new', 'contacted', 'proposal', 'won', 'lost')),
  stage_changed_at        timestamptz not null default now(),
  estimated_monthly_cents integer check (estimated_monthly_cents >= 0),
  source_id               uuid,
  converted_client_id     uuid,
  unique (id, org_id),
  foreign key (source_id, org_id) references public.sources (id, org_id)
    on delete set null (source_id),
  foreign key (converted_client_id, org_id) references public.clients (id, org_id)
    on delete set null (converted_client_id)
);
create index leads_org_stage_idx on public.leads (org_id, stage);
create index leads_source_id_idx on public.leads (source_id);

-- Keep stage_changed_at honest without relying on app code.
create or replace function public.touch_lead_stage()
returns trigger
language plpgsql
as $$
begin
  if new.stage is distinct from old.stage then
    new.stage_changed_at := now();
  end if;
  return new;
end;
$$;

create trigger leads_stage_changed
  before update of stage on public.leads
  for each row execute function public.touch_lead_stage();

-- ---------------------------------------------------------------------
-- 6 · Activity timeline
-- ---------------------------------------------------------------------

create table public.activities (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs(id) on delete cascade,
  created_at  timestamptz not null default now(),
  client_id   uuid,
  lead_id     uuid,
  kind        text not null default 'note'
                check (kind in ('note', 'call', 'email', 'payment', 'stage_change')),
  body        text,
  occurred_at timestamptz not null default now(),
  foreign key (client_id, org_id) references public.clients (id, org_id)
    on delete cascade,
  foreign key (lead_id, org_id) references public.leads (id, org_id)
    on delete cascade,
  check (client_id is not null or lead_id is not null)
);
create index activities_client_idx on public.activities (client_id, occurred_at desc);
create index activities_lead_idx   on public.activities (lead_id, occurred_at desc);
create index activities_org_id_idx on public.activities (org_id);

-- ---------------------------------------------------------------------
-- 7 · Tags
-- ---------------------------------------------------------------------

create table public.tags (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs(id) on delete cascade,
  created_at timestamptz not null default now(),
  name       text not null,
  color      text,
  unique (id, org_id),
  unique (org_id, name)
);

create table public.client_tags (
  org_id     uuid not null,
  client_id  uuid not null,
  tag_id     uuid not null,
  created_at timestamptz not null default now(),
  primary key (client_id, tag_id),
  foreign key (client_id, org_id) references public.clients (id, org_id) on delete cascade,
  foreign key (tag_id, org_id)    references public.tags (id, org_id)    on delete cascade
);
create index client_tags_org_id_idx on public.client_tags (org_id);
create index client_tags_tag_id_idx on public.client_tags (tag_id);

-- ---------------------------------------------------------------------
-- 8 · Row Level Security
-- (select current_org_id()) is wrapped in a subquery so Postgres runs it
-- once per statement instead of once per row.
-- ---------------------------------------------------------------------

alter table public.orgs            enable row level security;
alter table public.members         enable row level security;
alter table public.expenses        enable row level security;
alter table public.sources         enable row level security;
alter table public.clients         enable row level security;
alter table public.contacts        enable row level security;
alter table public.client_services enable row level security;
alter table public.payments        enable row level security;
alter table public.files           enable row level security;
alter table public.leads           enable row level security;
alter table public.activities      enable row level security;
alter table public.tags            enable row level security;
alter table public.client_tags     enable row level security;

-- orgs: read and update your own. Creation happens only in register_member_org.
create policy "read own org" on public.orgs
  for select to authenticated using (id = (select public.current_org_id()));
create policy "update own org" on public.orgs
  for update to authenticated
  using (id = (select public.current_org_id()))
  with check (id = (select public.current_org_id()));

-- members: see your org's members, edit only yourself.
create policy "read org members" on public.members
  for select to authenticated using (org_id = (select public.current_org_id()));
create policy "update self" on public.members
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and org_id = (select public.current_org_id()));

-- Every org-owned table gets the same full-access-within-org policy.
do $$
declare t text;
begin
  foreach t in array array[
    'expenses', 'sources', 'clients', 'contacts', 'client_services',
    'payments', 'files', 'leads', 'activities', 'tags', 'client_tags'
  ] loop
    execute format(
      'create policy "org members manage %1$s" on public.%1$I
         for all to authenticated
         using (org_id = (select public.current_org_id()))
         with check (org_id = (select public.current_org_id()))',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 9 · Signup: create org + member atomically
-- Matches src/app/auth/signup/actions/register.ts: takes a jsonb payload,
-- returns { success, code?, error?, sqlstate? } instead of raising.
-- Called with the service-role client, so it's locked to that role.
-- ---------------------------------------------------------------------

create or replace function public.register_member_org(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  insert into public.orgs (name)
  values (payload->>'org_name')
  returning id into v_org_id;

  insert into public.members (id, org_id, first_name, last_name, email, phone)
  values (
    (payload->>'user_id')::uuid,
    v_org_id,
    payload->>'first_name',
    payload->>'last_name',
    payload->>'email',
    nullif(payload->>'phone', '')
  );

  return jsonb_build_object('success', true, 'org_id', v_org_id);
exception when others then
  -- The block's inserts roll back automatically when an exception is caught.
  return jsonb_build_object(
    'success',  false,
    'code',     'register_failed',
    'error',    sqlerrm,
    'sqlstate', sqlstate
  );
end;
$$;

revoke execute on function public.register_member_org(jsonb) from public, anon, authenticated;
grant  execute on function public.register_member_org(jsonb) to service_role;

-- ---------------------------------------------------------------------
-- 10 · Derived numbers (one source of truth; RLS still applies)
-- ---------------------------------------------------------------------

-- Business costs are deductible, so tax applies only to what's left for you:
--   (revenue − business) × (1 − rate) ≥ personal
--   → floor = business + personal / (1 − rate)
create or replace function public.org_floor_cents(p_org uuid)
returns bigint
language sql
stable
as $$
  select ceil(
           coalesce(sum(e.amount_cents) filter (where e.scope = 'business'), 0)
         + coalesce(sum(e.amount_cents) filter (where e.scope = 'personal'), 0)
           / (1 - o.tax_reserve_rate)
         )::bigint
  from public.orgs o
  left join public.expenses e on e.org_id = o.id
  where o.id = p_org
  group by o.tax_reserve_rate
$$;

-- Monthly-equivalent revenue: $900 quarterly counts as $300/month.
create or replace function public.org_monthly_revenue_cents(p_org uuid)
returns bigint
language sql
stable
as $$
  select coalesce(round(sum(s.amount_cents::numeric / s.interval_months)), 0)::bigint
  from public.client_services s
  join public.clients c on c.id = s.client_id
  where s.org_id = p_org
    and c.status in ('active', 'onboarding')
    and s.started_on <= current_date
    and (s.ended_on is null or s.ended_on >= current_date)
$$;

-- Cash timing: does this service bill in the month containing p_month?
create or replace function public.service_due_in_month(
  p_started_on date,
  p_interval_months smallint,
  p_month date
)
returns boolean
language sql
immutable
as $$
  select date_trunc('month', p_month) >= date_trunc('month', p_started_on)
     and (
       (extract(year from p_month) * 12 + extract(month from p_month))
     - (extract(year from p_started_on) * 12 + extract(month from p_started_on))
     )::int % p_interval_months = 0
$$;

-- ---------------------------------------------------------------------
-- 11 · File storage: private bucket, one folder per org
-- Upload paths must start with the org id: "<org_id>/<client_id>/<file>"
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('client-files', 'client-files', false)
on conflict (id) do nothing;

create policy "org members manage their files" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'client-files'
    and (storage.foldername(name))[1] = (select public.current_org_id())::text
  )
  with check (
    bucket_id = 'client-files'
    and (storage.foldername(name))[1] = (select public.current_org_id())::text
  );

commit;

-- ---------- onboarding additions ----------
begin;

-- 1. Which onboarding category an expense row came from ("housing", "software", ...).
--    Nullable: expenses added later from the Money page can be custom, with no category.
--    Keys are validated in the app (constants.ts), not here, so adding a category
--    never needs a migration.
alter table public.expenses
  add column if not exists category text;

-- One row per category per org, so re-saving the floor step updates the
-- existing rows (upsert on org_id, category) instead of piling up duplicates.
-- A plain unique index, not a partial one: Supabase's upsert can't target a
-- partial index. NULLs never collide, so custom (null-category) rows are fine.
create unique index if not exists expenses_org_category_key
  on public.expenses (org_id, category);

-- 2. What the business brings in per month right now, in cents.
--    Used for the Life Vest until real clients are entered.
alter table public.orgs
  add column if not exists estimated_revenue_cents integer
    check (estimated_revenue_cents >= 0);

commit;
