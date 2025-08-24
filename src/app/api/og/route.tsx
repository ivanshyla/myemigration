import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const q = (searchParams.get("q") || "").slice(0, 160);
  const sub = (searchParams.get("sub") || "").slice(0, 280);
  const img = searchParams.get("img");
  const cap = (searchParams.get("cap") || "").slice(0, 80);
  const simple = searchParams.get("simple");

  if (simple) {
    // Minimal static-looking banner: white background + black title
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            color: "#111111",
            fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>Белэміграцыя</div>
            <div style={{ marginTop: 16, fontSize: 30, opacity: 0.9 }}>
              Колькі дзён у эміграцыі?
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const candidates = [
    "/photos/art-belarus-minsk-by-katia-syrayezhkina-scaled%20copy.jpg",
    "/photos/minsk-poster-belarus-wall-art-1143020719%20copy.jpg",
  ];
  // Deterministic pick by hashing q
  let hash = 0;
  for (let i = 0; i < q.length; i++) hash = (hash * 31 + q.charCodeAt(i)) >>> 0;
  const bg = candidates[hash % candidates.length];
  const bgUrl = `${origin}${bg}`;
  const trainUrl = `${origin}/photos/art-belarus-minsk-by-katia-syrayezhkina-scaled%20copy.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "stretch",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#111111",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%) blur(1px)",
            opacity: 0.28,
          }}
        />
        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(60% 60% at 50% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.6) 60%, rgba(255,255,255,0.2))",
          }}
        />
        {/* Window chrome */}
        <div style={{ position: "absolute", top: 32, left: 32, right: 32, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.82)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", padding: "0 16px", gap: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#ff5f57", border: "1px solid rgba(0,0,0,0.1)" }} />
            <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#febc2e", border: "1px solid rgba(0,0,0,0.1)" }} />
            <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#28c840", border: "1px solid rgba(0,0,0,0.1)" }} />
          </div>
          <div style={{ margin: "0 auto", fontSize: 24, opacity: 0.7 }}>Белэміграцыя</div>
        </div>

        {/* Archive card */}
        <div style={{ position: "absolute", inset: 0, padding: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              width: 1030,
              minHeight: 420,
              borderRadius: 12,
              background: "#faf7f2",
              border: "1px solid rgba(0,0,0,0.15)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px)",
              overflow: "hidden",
            }}
          >
            {/* pins */}
            <div style={{ position: "absolute", width: 8, height: 8, borderRadius: 9999, background: "rgba(0,0,0,0.2)", left: 8, top: 8 }} />
            <div style={{ position: "absolute", width: 8, height: 8, borderRadius: 9999, background: "rgba(0,0,0,0.2)", right: 8, top: 8 }} />
            <div style={{ position: "absolute", width: 8, height: 8, borderRadius: 9999, background: "rgba(0,0,0,0.2)", left: 8, bottom: 8 }} />
            <div style={{ position: "absolute", width: 8, height: 8, borderRadius: 9999, background: "rgba(0,0,0,0.2)", right: 8, bottom: 8 }} />

            {/* Train photo background */}
            <div
              style={{
                position: "absolute",
                top: 60,
                right: -10,
                width: 140,
                height: 90,
                backgroundImage: `url(${trainUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.12,
                filter: "grayscale(100%) sepia(30%) contrast(0.6) brightness(0.7)",
                transform: "rotate(6deg)",
                borderRadius: 6,
              }}
            />

            <div style={{ padding: 18, borderBottom: "1px solid rgba(0,0,0,0.1)", fontSize: 16, letterSpacing: 2, textTransform: "uppercase", color: "rgba(0,0,0,0.6)" }}>
              Архіўная картка
            </div>

            <div style={{ display: "flex", gap: 20, padding: 24, alignItems: "flex-start" }}>
              {img ? (
                <div style={{ width: 120, height: 120, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.15)", transform: "rotate(-1.5deg)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: "100%", height: "100%", backgroundImage: `url(${origin}${img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%) sepia(30%) contrast(0.9) brightness(0.95)" }} />
                </div>
              ) : null}
              <div style={{ maxWidth: 820 }}>
                <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.05 }}>{q || "Колькі дзён у эміграцыі?"}</div>
                {sub ? (
                  <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.35, color: "rgba(0,0,0,0.9)" }}>{sub}</div>
                ) : null}
                {cap ? (
                  <div style={{ marginTop: 14, fontSize: 18, textTransform: "uppercase", letterSpacing: 2, color: "rgba(0,0,0,0.6)" }}>{cap}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}


