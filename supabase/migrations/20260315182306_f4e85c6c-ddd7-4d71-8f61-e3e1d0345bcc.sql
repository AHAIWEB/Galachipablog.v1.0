
-- Drop existing overly-permissive policies
DROP POLICY IF EXISTS "Allow all deletes" ON public.posts;
DROP POLICY IF EXISTS "Allow all inserts" ON public.posts;
DROP POLICY IF EXISTS "Allow all updates" ON public.posts;

-- Authenticated users can do everything (admin)
CREATE POLICY "Authenticated users can insert posts"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
ON public.posts FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete posts"
ON public.posts FOR DELETE TO authenticated
USING (true);

-- Authenticated users can see all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts"
ON public.posts FOR SELECT TO authenticated
USING (true);
