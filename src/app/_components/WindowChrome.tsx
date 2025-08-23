"use client";
import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function WindowChrome({ title = "", children }: Props) {
  return (
    <div className="mx-auto max-w-3xl w-full">
      <div className="relative rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-black/10 overflow-hidden bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="h-9 sm:h-11 flex items-center px-2 sm:px-3 border-b border-black/10 bg-white/70">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="inline-block w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f57] border border-black/10" />
            <span className="inline-block w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#febc2e] border border-black/10" />
            <span className="inline-block w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#28c840] border border-black/10" />
          </div>
          {title ? (
            <div className="mx-auto text-xs sm:text-[13px] font-medium tracking-[-0.01em] opacity-70 select-none">
              {title}
            </div>
          ) : (
            <div className="mx-auto" />
          )}
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}


