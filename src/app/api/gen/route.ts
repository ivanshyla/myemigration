export const dynamic = "force-dynamic";

type GenBody = {
  prompt?: string;
};

// very simple in-memory cache and rate-limit (per server instance)
const CACHE = new Map<string, { text: string; at: number }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

const ipHits = new Map<string, number[]>();
const WINDOW_MS = 60_000; // 1 min
const LIMIT_PER_WINDOW = 3;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const list = (ipHits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= LIMIT_PER_WINDOW) return false;
  list.push(now);
  ipHits.set(ip, list);
  return true;
}

export async function POST(request: Request) {
  const { prompt }: GenBody = await request.json().catch(() => ({}));
  const key = process.env.OPENAI_API_KEY as string | undefined;
  if (!key) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not set" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0] || "anon";
  if (!rateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  const cleanPrompt = (prompt || "").trim();
  if (!cleanPrompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // cache
  const now = Date.now();
  const cached = CACHE.get(cleanPrompt);
  if (cached && now - cached.at < TTL_MS) {
    return new Response(JSON.stringify({ text: cached.text, cached: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  const sys =
    "Ты — лаканічны копірайтэр. Адкажы на беларускай мове 8–16 словамі, без хэштэгаў і эмажы. Стыль — архіўная картка, спакойна і без ацэнак.";

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: cleanPrompt },
    ],
    temperature: 0.7,
    max_tokens: 60,
  } as const;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    return new Response(JSON.stringify({ error: "OpenAI error", detail: errText }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
  type ChatCompletion = {
    choices?: Array<{
      message?: { content?: string };
    }>;
  };
  const data = (await resp.json()) as ChatCompletion;
  const text: string = data?.choices?.[0]?.message?.content?.trim() || "";

  if (text) CACHE.set(cleanPrompt, { text, at: now });

  return new Response(JSON.stringify({ text }), {
    headers: { "content-type": "application/json" },
  });
}


