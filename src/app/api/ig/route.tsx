import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const q = (searchParams.get("q") || "").slice(0, 160);
  const sub = (searchParams.get("sub") || "").slice(0, 320);
  const img = searchParams.get("img");
  const cap = (searchParams.get("cap") || "").slice(0, 80);

  // Portrait size for Instagram feed
  const width = 1080;
  const height = 1350;

  const brandUrl = `${origin}/brand/logo.png`;
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
          background: "#f8f5ee",
          color: "#111111",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand tiled background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${brandUrl})`,
            backgroundRepeat: "repeat",
            backgroundSize: "120px 120px",
            opacity: 0.06,
            filter: "grayscale(100%) sepia(30%) contrast(0.9) brightness(0.98)",
            WebkitMaskImage:
              "radial-gradient(80% 70% at 50% 40%, black 60%, transparent)",
            maskImage: "radial-gradient(80% 70% at 50% 40%, black 60%, transparent)",
          }}
        />

        {/* Archive card */}
        <div
          style={{
            position: "absolute",
            top: 72,
            left: 72,
            right: 72,
            bottom: 72,
            borderRadius: 24,
            background: "#faf7f2",
            border: "1px solid rgba(0,0,0,0.15)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(0,0,0,0.03) 14px, rgba(0,0,0,0.03) 15px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Train photo background */}
          <div
            style={{
              position: "absolute",
              top: 120,
              right: -20,
              width: 180,
              height: 120,
              backgroundImage: `url(${trainUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.15,
              filter: "grayscale(100%) sepia(25%) contrast(0.7) brightness(0.8)",
              transform: "rotate(8deg)",
              borderRadius: 8,
            }}
          />
          {/* pins */}
          <div style={{ position: "absolute", width: 12, height: 12, borderRadius: 9999, background: "rgba(0,0,0,0.2)", left: 14, top: 14 }} />
          <div style={{ position: "absolute", width: 12, height: 12, borderRadius: 9999, background: "rgba(0,0,0,0.2)", right: 14, top: 14 }} />
          <div style={{ position: "absolute", width: 12, height: 12, borderRadius: 9999, background: "rgba(0,0,0,0.2)", left: 14, bottom: 14 }} />
          <div style={{ position: "absolute", width: 12, height: 12, borderRadius: 9999, background: "rgba(0,0,0,0.2)", right: 14, bottom: 14 }} />

          <div style={{ padding: 32, borderBottom: "1px solid rgba(0,0,0,0.1)", fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "rgba(0,0,0,0.6)", textAlign: "center" }}>
            📂 Архіўная картка
          </div>
          <div style={{ padding: 32, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>{q || "Колькі дзён у эміграцыі?"}</div>
            <div style={{ fontSize: 28, lineHeight: 1.4, color: "rgba(0,0,0,0.85)", marginTop: 20 }}>{sub || ""}</div>
            <div style={{ marginTop: 32, fontSize: 18, color: "rgba(0,0,0,0.6)", textAlign: "center" }}>
              • • •
            </div>
            <div style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", textAlign: "center", marginTop: 16 }}>
              Тэст на белэміграцию.test
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}



