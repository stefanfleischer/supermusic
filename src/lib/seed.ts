import type { Song } from './types'

export const SEED_SONGS: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Amazing Grace',
    artist: 'John Newton',
    key: 'G',
    tempo: 72,
    timeSignature: '3/4',
    tags: ['hymn', 'classic', 'worship'],
    ccli: null,
    copyright: 'Public Domain',
    capo: 0,
    content: `{title: Amazing Grace}
{artist: John Newton}
{key: G}
{tempo: 72}
{time: 3/4}

{start_of_verse: Verse 1}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That [G]saved a [Em]wretch like [D]me
[G]I once was [G7]lost but [C]now am [G]found
Was [G]blind but [Em]now [D]I [G]see
{end_of_verse}

{start_of_verse: Verse 2}
[G]'Twas grace that [G7]taught my [C]heart to [G]fear
And [G]grace my [Em]fears re[D]lieved
[G]How precious [G7]did that [C]grace ap[G]pear
The [G]hour I [Em]first [D]be[G]lieved
{end_of_verse}

{start_of_verse: Verse 3}
[G]Through many [G7]dangers [C]toils and [G]snares
I [G]have al[Em]ready [D]come
[G]'Tis grace hath [G7]brought me [C]safe thus [G]far
And [G]grace will [Em]lead [D]me [G]home
{end_of_verse}

{start_of_verse: Verse 4}
[G]When we've been [G7]there ten [C]thousand [G]years
Bright [G]shining [Em]as the [D]sun
[G]We've no less [G7]days to [C]sing God's [G]praise
Than [G]when we [Em]first [D]be[G]gun
{end_of_verse}`,
  },
  {
    title: 'How Great Thou Art',
    artist: 'Carl Boberg',
    key: 'A',
    tempo: 80,
    timeSignature: '4/4',
    tags: ['hymn', 'worship', 'classic'],
    ccli: null,
    copyright: 'Public Domain',
    capo: 0,
    content: `{title: How Great Thou Art}
{artist: Carl Boberg}
{key: A}
{tempo: 80}

{start_of_verse: Verse 1}
[A]O Lord my [D]God when I in [A]awesome wonder
Consider [E]all the worlds thy [A]hands have made
[A]I see the [D]stars I hear the [A]rolling thunder
Thy power through[E]out the universe dis[A]played
{end_of_verse}

{start_of_chorus}
Then sings my [D]soul my Savior God to [A]Thee
How great Thou [E]art how great Thou [A]art
Then sings my [D]soul my Savior God to [A]Thee
How great Thou [E]art how great Thou [A]art
{end_of_chorus}

{start_of_verse: Verse 2}
[A]When through the [D]woods and forest [A]glades I wander
And hear the [E]birds sing sweetly [A]in the trees
[A]When I look [D]down from lofty [A]mountain grandeur
And hear the [E]brook and feel the [A]gentle breeze
{end_of_verse}`,
  },
  {
    title: 'Be Thou My Vision',
    artist: 'Irish Hymn',
    key: 'D',
    tempo: 100,
    timeSignature: '3/4',
    tags: ['hymn', 'irish', 'classic'],
    ccli: null,
    copyright: 'Public Domain',
    capo: 0,
    content: `{title: Be Thou My Vision}
{artist: Irish Hymn}
{key: D}
{tempo: 100}
{time: 3/4}

{start_of_verse: Verse 1}
[D]Be Thou my [G]vision O [D]Lord of my [A]heart
[Bm]Naught be all [G]else to me [A]save that Thou [D]art
[D]Thou my best [G]thought by [D]day or by [A]night
[Bm]Waking or [G]sleeping Thy [A]presence my [D]light
{end_of_verse}

{start_of_verse: Verse 2}
[D]Be Thou my [G]wisdom and [D]Thou my true [A]word
[Bm]I ever [G]with Thee and [A]Thou with [D]me Lord
[D]Thou my great [G]Father and [D]I Thy true [A]son
[Bm]Thou in me [G]dwelling and [A]I with Thee [D]one
{end_of_verse}

{start_of_verse: Verse 3}
[D]High King of [G]heaven my [D]victory [A]won
[Bm]May I reach [G]heaven's joys [A]O bright heaven's [D]sun
[D]Heart of my [G]own heart what[D]ever be[A]fall
[Bm]Still be my [G]vision O [A]Ruler of [D]all
{end_of_verse}`,
  },
  {
    title: 'Holy Holy Holy',
    artist: 'Reginald Heber',
    key: 'D',
    tempo: 90,
    timeSignature: '4/4',
    tags: ['hymn', 'worship', 'trinitarian'],
    ccli: null,
    copyright: 'Public Domain',
    capo: 0,
    content: `{title: Holy Holy Holy}
{artist: Reginald Heber}
{key: D}
{tempo: 90}

{start_of_verse: Verse 1}
[D]Holy holy [A]holy [Bm]Lord God Al[D]mighty
[G]Early in the [D]morning our [A]song shall rise to [D]Thee
[D]Holy holy [A]holy [Bm]merciful and [D]mighty
[G]God in three [D]persons [A]blessed Trini[D]ty
{end_of_verse}

{start_of_verse: Verse 2}
[D]Holy holy [A]holy [Bm]all the saints a[D]dore Thee
[G]Casting down their [D]golden crowns a[A]round the glassy [D]sea
[D]Cherubim and [A]seraphim [Bm]falling down be[D]fore Thee
[G]Which wert and [D]art and [A]evermore shalt [D]be
{end_of_verse}`,
  },
  {
    title: 'Simple Gifts',
    artist: 'Joseph Brackett',
    key: 'C',
    tempo: 120,
    timeSignature: '2/4',
    tags: ['folk', 'shaker', 'classic'],
    ccli: null,
    copyright: 'Public Domain',
    capo: 0,
    content: `{title: Simple Gifts}
{artist: Joseph Brackett}
{key: C}
{tempo: 120}
{time: 2/4}

{start_of_verse: Verse 1}
[C]'Tis the gift to be simple 'tis the [F]gift to be [C]free
'Tis the [C]gift to come down [G]where we ought to [C]be
And [C]when we find ourselves in the [F]place just [C]right
'Twill [C]be in the [G]valley of [F]love and de[C]light
{end_of_verse}

{start_of_chorus}
[C]When true simplicity is gained
To [F]bow and to [C]bend we [G]shan't be a[C]shamed
To [C]turn turn will [Am]be our de[F]light
'Til by [C]turning [G]turning we [F]come 'round [C]right
{end_of_chorus}`,
  },
  {
    title: 'Swing Low Sweet Chariot',
    artist: 'Traditional Spiritual',
    key: 'E',
    tempo: 72,
    timeSignature: '4/4',
    tags: ['spiritual', 'folk', 'classic'],
    ccli: null,
    copyright: 'Public Domain',
    capo: 0,
    content: `{title: Swing Low Sweet Chariot}
{artist: Traditional Spiritual}
{key: E}
{tempo: 72}

{start_of_chorus}
[E]Swing low sweet [A]chari[E]ot
Coming for to carry me [B7]home
[E]Swing low sweet [A]chari[E]ot
Coming for to [B7]carry me [E]home
{end_of_chorus}

{start_of_verse: Verse 1}
[E]I looked over Jordan and [A]what did I [E]see
Coming for to carry me [B7]home
[E]A band of angels [A]coming after [E]me
Coming for to [B7]carry me [E]home
{end_of_verse}

{start_of_verse: Verse 2}
[E]If you get there be[A]fore I [E]do
Coming for to carry me [B7]home
[E]Tell all my friends I'm [A]coming [E]too
Coming for to [B7]carry me [E]home
{end_of_verse}`,
  },
]
