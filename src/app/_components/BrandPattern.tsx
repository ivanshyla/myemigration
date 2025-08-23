"use client";

export default function BrandPattern() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        // Tile the brand mark softly across the page
        backgroundImage: `url(/brand/logo.png)`,
        backgroundRepeat: "repeat",
        // smaller tile = много повторений ("1000 раз")
        backgroundSize: "80px 80px",
        opacity: 0.06,
        mixBlendMode: "multiply",
        // архивная серость + лёгкий блюр, чтобы не отвлекал
        filter: "grayscale(100%) contrast(0.85) brightness(0.98) blur(1.2px)",
        // мягкая виньетка, чтобы текст читался
        WebkitMaskImage:
          "radial-gradient(75% 65% at 50% 40%, black 60%, transparent)",
        maskImage: "radial-gradient(75% 65% at 50% 40%, black 60%, transparent)",
        backgroundColor: "#faf7f2",
      }}
    />
  );
}


