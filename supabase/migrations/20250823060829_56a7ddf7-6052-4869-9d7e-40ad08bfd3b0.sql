-- Fix bookmarks table article_id column type
ALTER TABLE public.bookmarks 
ALTER COLUMN article_id TYPE TEXT;