
-- Add tags array and featured flag to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Create index for tags
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts (featured) WHERE featured = true;
