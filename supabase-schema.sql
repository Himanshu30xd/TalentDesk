-- TalentDesk Supabase schema (DRAFT: not yet run or tested against a real project).
-- Run in Supabase > SQL Editor. Use only the project URL and the "anon" key in the frontend.
-- NEVER put the service_role key in app.js or any file in the GitHub repo.

create table organizations (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz default now());
create table org_members (
  org_id uuid references organizations on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null default 'recruiter' check (role in ('admin','recruiter','viewer')),
  primary key (org_id, user_id));
create table jobs (
  id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade,
  title text not null, dept text, location text, type text, experience text, salary text,
  deadline date, status text not null default 'Open' check (status in ('Open','Closed')),
  description text, created_at timestamptz default now());
create table candidates (
  id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade,
  job_id uuid references jobs on delete set null,
  name text not null, email text, note text, stage text not null default 'Applied',
  applied_at date default current_date, unique (org_id, email));
create table events (
  id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade,
  job_id uuid references jobs on delete set null,
  title text not null, type text not null check (type in ('Interview','Hiring drive','HR meeting')),
  event_date date not null, event_time time, location text, people text,
  status text not null default 'Scheduled' check (status in ('Scheduled','Completed','Cancelled')));

create or replace function is_member(o uuid, roles text[] default array['admin','recruiter','viewer'])
returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from org_members m where m.org_id = o and m.user_id = auth.uid() and m.role = any(roles)) $$;

alter table organizations enable row level security; alter table org_members enable row level security;
alter table jobs enable row level security; alter table candidates enable row level security; alter table events enable row level security;

create policy org_read on organizations for select using (is_member(id));
create policy mem_read on org_members for select using (user_id = auth.uid());
-- Same three policies on jobs, candidates, events: members read, admins and recruiters write.
do $$ declare t text; begin foreach t in array array['jobs','candidates','events'] loop
  execute format('create policy %I_read on %I for select using (is_member(org_id))', t, t);
  execute format('create policy %I_write on %I for all using (is_member(org_id, array[''admin'',''recruiter''])) with check (is_member(org_id, array[''admin'',''recruiter'']))', t, t);
end loop; end $$;

-- Public "Apply Now" form for logged-out visitors: insert only, only for open jobs, no read access.
create policy candidates_public_apply on candidates for insert to anon
  with check (exists (select 1 from jobs j where j.id = job_id and j.org_id = candidates.org_id and j.status = 'Open'));
