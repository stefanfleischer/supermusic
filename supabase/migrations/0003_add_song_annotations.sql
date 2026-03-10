-- ─── Song Annotations ────────────────────────────────────────────────────
create table song_annotations (
  id         uuid        primary key default gen_random_uuid(),
  song_id    uuid        not null references songs(id) on delete cascade,
  type       text        not null,
  data       jsonb       not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table song_annotations enable row level security;
create policy "public access" on song_annotations for all using (true) with check (true);

create index song_annotations_song_id_idx on song_annotations(song_id);
