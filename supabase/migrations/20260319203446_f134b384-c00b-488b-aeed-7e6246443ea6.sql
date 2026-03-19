
-- RSS feeds table for admin-managed feed sources
CREATE TABLE public.rss_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;

-- Everyone can read feeds
CREATE POLICY "Anyone can view feeds" ON public.rss_feeds
  FOR SELECT TO public USING (true);

-- Only admins can manage feeds
CREATE POLICY "Admins can insert feeds" ON public.rss_feeds
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feeds" ON public.rss_feeds
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feeds" ON public.rss_feeds
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add editor role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';

-- Insert default BD news sources
INSERT INTO public.rss_feeds (name, url) VALUES
  ('প্রথম আলো', 'https://www.prothomalo.com/feed'),
  ('বাংলানিউজ', 'https://www.banglanews24.com/rss/rss.xml'),
  ('যুগান্তর', 'https://www.jugantor.com/feed/rss.xml'),
  ('কালের কণ্ঠ', 'https://www.kalerkantho.com/rss.xml'),
  ('সমকাল', 'https://samakal.com/feed'),
  ('ইত্তেফাক', 'https://www.ittefaq.com.bd/feed'),
  ('বাংলাদেশ প্রতিদিন', 'https://www.bd-pratidin.com/feed');
