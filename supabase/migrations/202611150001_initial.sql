create extension if not exists pgcrypto;

create type public.user_role as enum ('learner', 'admin');
create type public.invite_status as enum ('active', 'revoked');
create type public.starting_level as enum ('foundations', 'refresher', 'core');
create type public.topic_state as enum ('not_started', 'learning', 'practicing', 'review_due', 'retained');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (email = lower(email)),
  display_name text,
  timezone text not null default 'UTC',
  starting_level public.starting_level,
  default_session_minutes smallint not null default 30 check (default_session_minutes in (15, 30, 45, 60)),
  role public.user_role not null default 'learner',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.beta_invites (
  id uuid primary key default gen_random_uuid(), email text not null unique check (email = lower(email)),
  status public.invite_status not null default 'active', invited_by uuid references public.profiles(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.enrollments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  path_id text not null default 'mathematics-core', placement jsonb, learner_override boolean not null default false,
  created_at timestamptz not null default now(), unique(user_id, path_id)
);
create table public.study_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  budget_minutes smallint not null check (budget_minutes in (15,30,45,60)), plan jsonb not null,
  current_step text, started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now()
);
create table public.attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete set null, question_id text not null, content_version integer not null,
  submitted_answer jsonb not null, correct boolean, confidence text not null check (confidence in ('low','medium','high')),
  hints_used integer not null default 0 check (hints_used >= 0), elapsed_seconds integer not null check (elapsed_seconds >= 0),
  created_at timestamptz not null default now()
);
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null, state public.topic_state not null default 'not_started', mastery_evidence jsonb not null default '{}'::jsonb,
  last_activity_at timestamptz, unique(user_id, lesson_id)
);
create table public.review_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null, question_id text, source text not null, due_at timestamptz not null, interval_days integer not null default 1,
  successful_reviews integer not null default 0, completed_at timestamptz, created_at timestamptz not null default now()
);
create table public.mistakes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  attempt_id uuid references public.attempts(id) on delete set null, category text not null, learner_note text,
  priority text not null default 'normal' check (priority in ('normal','high')), resolved_at timestamptz, created_at timestamptz not null default now()
);
create table public.doubts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null, body text not null check (char_length(body) between 1 and 4000), status text not null default 'open' check (status in ('open','investigating','resolved')),
  resolution text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.reflections (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete set null, lesson_id text not null,
  explanation text not null check (char_length(explanation) between 1 and 8000), clarity text not null check (clarity in ('foggy','forming','clear')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.beta_invites enable row level security;
alter table public.enrollments enable row level security;
alter table public.study_sessions enable row level security;
alter table public.attempts enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.review_items enable row level security;
alter table public.mistakes enable row level security;
alter table public.doubts enable row level security;
alter table public.reflections enable row level security;

create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
create policy "read own profile" on public.profiles for select using (id = auth.uid());
create policy "insert learner profile" on public.profiles for insert with check (id = auth.uid() and role = 'learner');
create policy "read matching invite" on public.beta_invites for select using (email = lower(coalesce(auth.jwt()->>'email','')) or public.is_admin());
create policy "admin manages invites" on public.beta_invites for all using (public.is_admin()) with check (public.is_admin());

do $$ declare t text; begin
  foreach t in array array['enrollments','study_sessions','attempts','lesson_progress','review_items','mistakes','doubts','reflections'] loop
    execute format('create policy "own rows" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

create index attempts_user_question_idx on public.attempts(user_id, question_id, created_at desc);
create index review_items_due_idx on public.review_items(user_id, due_at) where completed_at is null;
create index mistakes_open_idx on public.mistakes(user_id, created_at desc) where resolved_at is null;
