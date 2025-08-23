"use client";
import RandomBackground from "./_components/RandomBackground";
import BrandPattern from "./_components/BrandPattern";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RandomBackground />
      <BrandPattern />
      <div className="relative z-0">{children}</div>
    </>
  );
}


