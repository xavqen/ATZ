export const runtime = "edge";

type AdMetadata = {
  page: string;
  slots: Array<{
    id: string;
    format: string;
    priority: number;
  }>;
  cachedAt: string;
};

async function redisGet(key: string): Promise<AdMetadata | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const response = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });

  if (!response.ok) return null;

  const json = await response.json();
  if (!json.result) return null;

  return JSON.parse(json.result) as AdMetadata;
}

async function redisSet(key: string, value: AdMetadata, ttlSeconds: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return;

  await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}?EX=${ttlSeconds}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
}

async function fetchMetadata(page: string): Promise<AdMetadata> {
  const origin = process.env.AD_METADATA_ORIGIN;

  if (origin) {
    const response = await fetch(`${origin}?page=${encodeURIComponent(page)}`, {
      next: { revalidate: 60 }
    });

    if (response.ok) return response.json();
  }

  return {
    page,
    slots: [
      { id: "top-banner", format: "728x90", priority: 1 },
      { id: "box", format: "300x250", priority: 2 },
      { id: "mobile", format: "320x50", priority: 3 }
    ],
    cachedAt: new Date().toISOString()
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "home";
  const key = `ad-metadata:${page}`;

  const cached = await redisGet(key);

  if (cached) {
    return Response.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, s-maxage=600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
        "X-Cache": "HIT"
      }
    });
  }

  const fresh = await fetchMetadata(page);
  await redisSet(key, fresh, 60);

  return Response.json(fresh, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "CDN-Cache-Control": "public, s-maxage=600",
      "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      "X-Cache": "MISS"
    }
  });
}
