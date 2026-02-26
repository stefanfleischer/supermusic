-- ─── Songs ────────────────────────────────────────────────────────────────
create table songs (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  artist         text        not null default '',
  key            text,
  tempo          integer,
  time_signature text,
  tags           text[]      default '{}',
  ccli           text,
  copyright      text,
  content        text        not null default '',
  capo           integer     not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table songs enable row level security;
create policy "public access" on songs for all using (true) with check (true);

-- ─── Books ────────────────────────────────────────────────────────────────
create table books (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  description text        not null default '',
  song_ids    uuid[]      default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table books enable row level security;
create policy "public access" on books for all using (true) with check (true);

-- ─── Setlists ─────────────────────────────────────────────────────────────
create table setlists (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  description  text        not null default '',
  date         date,
  song_entries jsonb       not null default '[]',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table setlists enable row level security;
create policy "public access" on setlists for all using (true) with check (true);

-- ─── Seed Data ────────────────────────────────────────────────────────────
insert into songs (title, artist, key, tempo, time_signature, tags, ccli, copyright, capo, content) values
(
  'Amazing Grace',
  'John Newton',
  'G',
  72,
  '3/4',
  '{"hymn","classic","worship"}',
  null,
  'Public Domain',
  0,
  E'{title: Amazing Grace}\n{artist: John Newton}\n{key: G}\n{tempo: 72}\n{time: 3/4}\n\n{start_of_verse: Verse 1}\n[G]Amazing [G7]grace how [C]sweet the [G]sound\nThat [G]saved a [Em]wretch like [D]me\n[G]I once was [G7]lost but [C]now am [G]found\nWas [G]blind but [Em]now [D]I [G]see\n{end_of_verse}\n\n{start_of_verse: Verse 2}\n[G]''Twas grace that [G7]taught my [C]heart to [G]fear\nAnd [G]grace my [Em]fears re[D]lieved\n[G]How precious [G7]did that [C]grace ap[G]pear\nThe [G]hour I [Em]first [D]be[G]lieved\n{end_of_verse}\n\n{start_of_verse: Verse 3}\n[G]Through many [G7]dangers [C]toils and [G]snares\nI [G]have al[Em]ready [D]come\n[G]''Tis grace hath [G7]brought me [C]safe thus [G]far\nAnd [G]grace will [Em]lead [D]me [G]home\n{end_of_verse}\n\n{start_of_verse: Verse 4}\n[G]When we''ve been [G7]there ten [C]thousand [G]years\nBright [G]shining [Em]as the [D]sun\n[G]We''ve no less [G7]days to [C]sing God''s [G]praise\nThan [G]when we [Em]first [D]be[G]gun\n{end_of_verse}'
),
(
  'How Great Thou Art',
  'Carl Boberg',
  'A',
  80,
  '4/4',
  '{"hymn","worship","classic"}',
  null,
  'Public Domain',
  0,
  E'{title: How Great Thou Art}\n{artist: Carl Boberg}\n{key: A}\n{tempo: 80}\n\n{start_of_verse: Verse 1}\n[A]O Lord my [D]God when I in [A]awesome wonder\nConsider [E]all the worlds thy [A]hands have made\n[A]I see the [D]stars I hear the [A]rolling thunder\nThy power through[E]out the universe dis[A]played\n{end_of_verse}\n\n{start_of_chorus}\nThen sings my [D]soul my Savior God to [A]Thee\nHow great Thou [E]art how great Thou [A]art\nThen sings my [D]soul my Savior God to [A]Thee\nHow great Thou [E]art how great Thou [A]art\n{end_of_chorus}\n\n{start_of_verse: Verse 2}\n[A]When through the [D]woods and forest [A]glades I wander\nAnd hear the [E]birds sing sweetly [A]in the trees\n[A]When I look [D]down from lofty [A]mountain grandeur\nAnd hear the [E]brook and feel the [A]gentle breeze\n{end_of_verse}'
),
(
  'Be Thou My Vision',
  'Irish Hymn',
  'D',
  100,
  '3/4',
  '{"hymn","irish","classic"}',
  null,
  'Public Domain',
  0,
  E'{title: Be Thou My Vision}\n{artist: Irish Hymn}\n{key: D}\n{tempo: 100}\n{time: 3/4}\n\n{start_of_verse: Verse 1}\n[D]Be Thou my [G]vision O [D]Lord of my [A]heart\n[Bm]Naught be all [G]else to me [A]save that Thou [D]art\n[D]Thou my best [G]thought by [D]day or by [A]night\n[Bm]Waking or [G]sleeping Thy [A]presence my [D]light\n{end_of_verse}\n\n{start_of_verse: Verse 2}\n[D]Be Thou my [G]wisdom and [D]Thou my true [A]word\n[Bm]I ever [G]with Thee and [A]Thou with [D]me Lord\n[D]Thou my great [G]Father and [D]I Thy true [A]son\n[Bm]Thou in me [G]dwelling and [A]I with Thee [D]one\n{end_of_verse}\n\n{start_of_verse: Verse 3}\n[D]High King of [G]heaven my [D]victory [A]won\n[Bm]May I reach [G]heaven''s joys [A]O bright heaven''s [D]sun\n[D]Heart of my [G]own heart what[D]ever be[A]fall\n[Bm]Still be my [G]vision O [A]Ruler of [D]all\n{end_of_verse}'
),
(
  'Holy Holy Holy',
  'Reginald Heber',
  'D',
  90,
  '4/4',
  '{"hymn","worship","trinitarian"}',
  null,
  'Public Domain',
  0,
  E'{title: Holy Holy Holy}\n{artist: Reginald Heber}\n{key: D}\n{tempo: 90}\n\n{start_of_verse: Verse 1}\n[D]Holy holy [A]holy [Bm]Lord God Al[D]mighty\n[G]Early in the [D]morning our [A]song shall rise to [D]Thee\n[D]Holy holy [A]holy [Bm]merciful and [D]mighty\n[G]God in three [D]persons [A]blessed Trini[D]ty\n{end_of_verse}\n\n{start_of_verse: Verse 2}\n[D]Holy holy [A]holy [Bm]all the saints a[D]dore Thee\n[G]Casting down their [D]golden crowns a[A]round the glassy [D]sea\n[D]Cherubim and [A]seraphim [Bm]falling down be[D]fore Thee\n[G]Which wert and [D]art and [A]evermore shalt [D]be\n{end_of_verse}'
),
(
  'Simple Gifts',
  'Joseph Brackett',
  'C',
  120,
  '2/4',
  '{"folk","shaker","classic"}',
  null,
  'Public Domain',
  0,
  E'{title: Simple Gifts}\n{artist: Joseph Brackett}\n{key: C}\n{tempo: 120}\n{time: 2/4}\n\n{start_of_verse: Verse 1}\n[C]''Tis the gift to be simple ''tis the [F]gift to be [C]free\n''Tis the [C]gift to come down [G]where we ought to [C]be\nAnd [C]when we find ourselves in the [F]place just [C]right\n''Twill [C]be in the [G]valley of [F]love and de[C]light\n{end_of_verse}\n\n{start_of_chorus}\n[C]When true simplicity is gained\nTo [F]bow and to [C]bend we [G]shan''t be a[C]shamed\nTo [C]turn turn will [Am]be our de[F]light\n''Til by [C]turning [G]turning we [F]come ''round [C]right\n{end_of_chorus}'
),
(
  'Swing Low Sweet Chariot',
  'Traditional Spiritual',
  'E',
  72,
  '4/4',
  '{"spiritual","folk","classic"}',
  null,
  'Public Domain',
  0,
  E'{title: Swing Low Sweet Chariot}\n{artist: Traditional Spiritual}\n{key: E}\n{tempo: 72}\n\n{start_of_chorus}\n[E]Swing low sweet [A]chari[E]ot\nComing for to carry me [B7]home\n[E]Swing low sweet [A]chari[E]ot\nComing for to [B7]carry me [E]home\n{end_of_chorus}\n\n{start_of_verse: Verse 1}\n[E]I looked over Jordan and [A]what did I [E]see\nComing for to carry me [B7]home\n[E]A band of angels [A]coming after [E]me\nComing for to [B7]carry me [E]home\n{end_of_verse}\n\n{start_of_verse: Verse 2}\n[E]If you get there be[A]fore I [E]do\nComing for to carry me [B7]home\n[E]Tell all my friends I''m [A]coming [E]too\nComing for to [B7]carry me [E]home\n{end_of_verse}'
);
