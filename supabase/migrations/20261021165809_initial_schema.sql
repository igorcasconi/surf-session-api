create table public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text not null
    check (char_length(trim(full_name)) > 0),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create table public.peaks (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null
    check (char_length(trim(name)) > 0),

  city text,

  created_at timestamptz not null default now(),

  constraint peaks_user_name_unique
    unique (user_id, name),

  constraint peaks_user_id_id_unique
    unique (user_id, id)
);

create table public.surfs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  peak_id uuid not null,

  waves_count integer not null
    check (waves_count >= 0),

  duration_minutes integer not null
    check (duration_minutes > 0),

  surfed_at timestamptz not null,

  created_at timestamptz not null default now(),

  constraint surfs_peak_owner_fk
    foreign key (user_id, peak_id)
    references public.peaks(user_id, id)
    on delete restrict
);

foreign key (user_id, peak_id)
references public.peaks(user_id, id)

create index idx_peaks_user_id
  on public.peaks(user_id);

create index idx_surfs_user_id_surfed_at
  on public.surfs(user_id, surfed_at desc);

create index idx_surfs_peak_id
  on public.surfs(peak_id);

  alter table public.profiles
  enable row level security;

alter table public.peaks
  enable row level security;

alter table public.surfs
  enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = id
)
with check (
  (select auth.uid()) = id
);

create policy "peaks_select_own"
on public.peaks
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "peaks_insert_own"
on public.peaks
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "peaks_update_own"
on public.peaks
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "peaks_delete_own"
on public.peaks
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "surfs_select_own"
on public.surfs
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "surfs_insert_own"
on public.surfs
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "surfs_update_own"
on public.surfs
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "surfs_delete_own"
on public.surfs
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);