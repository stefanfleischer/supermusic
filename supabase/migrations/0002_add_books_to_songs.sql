-- Add books column to songs table
alter table songs add column if not exists books text[] default '{}';
