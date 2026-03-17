const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RssItem {
  title: string;
  link: string;
  description: string;
  image: string;
  pubDate: string;
  source: string;
}

const extractImage = (html: string): string => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  const enclosure = html.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  return enclosure?.[1] || "";
};

const parseRss = (xml: string, sourceName: string): RssItem[] => {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
    const block = match[1];
    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() || "";
    const link = block.match(/<link[^>]*>(.*?)<\/link>/i)?.[1]?.trim() || "";
    const desc = block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() || "";
    const pubDate = block.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i)?.[1]?.trim() || "";
    
    // Try media:content, media:thumbnail, enclosure, or extract from description
    let image = block.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] || "";
    if (!image) image = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] || "";
    if (!image) image = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i)?.[1] || "";
    if (!image) image = extractImage(desc);

    if (title) {
      items.push({
        title,
        link,
        description: desc.replace(/<[^>]*>/g, "").slice(0, 200),
        image,
        pubDate,
        source: sourceName,
      });
    }
  }
  return items;
};

const parseAtom = (xml: string, sourceName: string): RssItem[] => {
  const items: RssItem[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRegex.exec(xml)) !== null && items.length < 20) {
    const block = match[1];
    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() || "";
    const linkMatch = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
    const link = linkMatch?.[1] || block.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1] || "";
    const summary = block.match(/<(?:summary|content)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:summary|content)>/i)?.[1]?.trim() || "";
    const pubDate = block.match(/<(?:published|updated)[^>]*>(.*?)<\/(?:published|updated)>/i)?.[1]?.trim() || "";
    const image = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] || extractImage(summary);

    if (title) {
      items.push({
        title,
        link,
        description: summary.replace(/<[^>]*>/g, "").slice(0, 200),
        image,
        pubDate,
        source: sourceName,
      });
    }
  }
  return items;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { feeds } = await req.json();
    // feeds: Array<{ url: string, name: string }>
    if (!feeds || !Array.isArray(feeds) || feeds.length === 0) {
      return new Response(JSON.stringify({ error: "feeds array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allItems: RssItem[] = [];

    await Promise.all(
      feeds.map(async (feed: { url: string; name: string }) => {
        try {
          const res = await fetch(feed.url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
          });
          const xml = await res.text();
          
          const isAtom = xml.includes("<feed") && xml.includes("xmlns=\"http://www.w3.org/2005/Atom\"");
          const items = isAtom ? parseAtom(xml, feed.name) : parseRss(xml, feed.name);
          allItems.push(...items);
        } catch (err) {
          console.warn(`Failed to fetch feed ${feed.url}:`, err);
        }
      })
    );

    // Sort by date descending
    allItems.sort((a, b) => {
      const da = new Date(a.pubDate).getTime() || 0;
      const db = new Date(b.pubDate).getTime() || 0;
      return db - da;
    });

    return new Response(JSON.stringify({ items: allItems.slice(0, 30) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
