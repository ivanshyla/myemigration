"use client";
import Image from "next/image";

export default function Avatar({ url, emoji, alt }: { url?: string; emoji?: string; alt: string }) {
  if (!url) {
    return (
      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-lg">
        {emoji || "👤"}
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10 bg-white">
      <Image src={url} alt={alt} width={40} height={40} className="object-cover w-full h-full" />
    </div>
  );
}




