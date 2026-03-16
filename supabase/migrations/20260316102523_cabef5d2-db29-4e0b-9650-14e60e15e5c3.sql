-- Fix posts table RLS: only admin/reporter can modify
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON public.posts;

CREATE POLICY "Admin/Reporter can insert posts"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'reporter'));

CREATE POLICY "Admin/Reporter can update posts"
ON public.posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'reporter'));

CREATE POLICY "Admin can delete posts"
ON public.posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view all posts"
ON public.posts FOR SELECT TO authenticated
USING (true);