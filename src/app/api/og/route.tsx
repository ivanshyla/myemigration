import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").slice(0, 120);
  const sub = (searchParams.get("sub") || "").slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "white",
          color: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: -1 }}>
          {q || "Колькі дзён у эміграцыі?"}
        </div>
        {sub ? (
          <div style={{ marginTop: 24, fontSize: 40, opacity: 0.85 }}>{sub}</div>
        ) : null}
        <div style={{ position: "absolute", bottom: 32, fontSize: 28, opacity: 0.7 }}>
          myemigration.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}


