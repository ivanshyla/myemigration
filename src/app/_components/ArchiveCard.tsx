"use client";
import Image from "next/image";

type Props = {
  title: string;
  body?: string;
  photoUrl?: string;
  caption?: string;
};

export default function ArchiveCard({ title, body, photoUrl, caption }: Props) {
  return (
    <div
      className="relative border border-black/15 rounded-lg bg-[#faf7f2] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 11px)",
      }}
    >
      {/* corner pins */}
      <span className="absolute w-2 h-2 rounded-full bg-black/20 left-2 top-2" />
      <span className="absolute w-2 h-2 rounded-full bg-black/20 right-2 top-2" />
      <span className="absolute w-2 h-2 rounded-full bg-black/20 left-2 bottom-2" />
      <span className="absolute w-2 h-2 rounded-full bg-black/20 right-2 bottom-2" />

      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-black/10 text-[11px] sm:text-[12px] tracking-wider text-black/60">
        Ваш вынік
      </div>

      <div className="p-3 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center sm:items-start">
        {photoUrl ? (
          <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-black/15 shadow-sm rotate-[-1.5deg]">
            <Image
              src={photoUrl}
              alt={caption || ""}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(100%) sepia(30%) contrast(0.9) brightness(0.95)" }}
            />
          </div>
        ) : null}
        <div className="min-w-0 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-[-0.01em]">{title}</h3>
          {body ? <p className="mt-2 text-sm sm:text-[15px] leading-relaxed opacity-85 whitespace-pre-line">{body}</p> : null}
          {caption ? <div className="mt-2 sm:mt-3 text-xs uppercase tracking-wide text-black/60">{caption}</div> : null}
        </div>
      </div>
    </div>
  );
}


