"use client";
import { useEffect, useMemo, useState } from "react";

const CANDIDATES = [
  "/photos/art-belarus-minsk-by-katia-syrayezhkina-scaled%20copy.jpg",
  "/photos/minsk-poster-belarus-wall-art-1143020719%20copy.jpg",
];

export default function RandomBackground() {
  const [idx, setIdx] = useState<number>(0);
  const image = useMemo(() => CANDIDATES[idx % CANDIDATES.length], [idx]);

  useEffect(() => {
    // Pick stable random per visit
    const seed = Math.floor(Math.random() * 1e9);
    setIdx(seed);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 opacity-25 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "grayscale(100%) blur(1px)",
      }}
    />
  );
}


