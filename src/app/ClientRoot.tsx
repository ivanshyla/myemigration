"use client";
import RandomBackground from "./_components/RandomBackground";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RandomBackground />
      <div className="relative z-0">{children}</div>
    </>
  );
}


