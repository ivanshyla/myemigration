"use client";
import { useMemo, useState } from "react";
import { EMIGRANTS } from "@/lib/emigrants";
import { AppLang, buildMessage } from "@/lib/messages";

type Props = { initialDate?: string; initialLang?: AppLang };

export default function AppClient({ initialDate, initialLang = "be" }: Props) {
  const [start, setStart] = useState<string>(initialDate || "");
  const [lang, setLang] = useState<AppLang>(initialLang);

  const result = useMemo(() => {
    if (!start) return null;
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return null;
    const built = buildMessage(startDate, lang);
    const search = new URLSearchParams({ d: start, l: lang }).toString();
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}?${search}` : "";
    return { ...built, shareUrl };
  }, [start, lang]);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">Белэміграцыя</h1>
        <p className="mt-3 text-lg opacity-80">Колькі дзён ты правёў(-ла) ў эміграцыі?</p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-2 w-full sm:w-auto">
            <span className="text-sm opacity-70">Дата адʼезду</span>
            <input
              type="date"
              className="border border-black/10 rounded-md px-3 py-2 text-base"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </label>
          <label className="flex flex-col gap-2 w-full sm:w-auto">
            <span className="text-sm opacity-70">Мова / Язык</span>
            <select
              className="border border-black/10 rounded-md px-3 py-2 text-base"
              value={lang}
              onChange={(e) => setLang(e.target.value as AppLang)}
            >
              <option value="be">Беларуская</option>
              <option value="ru">Русский</option>
            </select>
          </label>
        </div>

        {result ? (
          <section className="mt-10 rounded-2xl border border-black/10 p-6 bg-white">
            <div className="text-2xl sm:text-3xl">{result.text}</div>
            <p className="mt-3 opacity-80">{result.sub}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 hover:bg-black/5" href={result.og} target="_blank" rel="noopener noreferrer">
                📷 Згенераваць картку
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 hover:bg-black/5"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.text)}&url=${encodeURIComponent(result.shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                𝕏 Tweet
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 hover:bg-black/5"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(result.shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 hover:bg-black/5"
                href={`https://threads.net/intent/post?text=${encodeURIComponent(result.text)}%20${encodeURIComponent(result.shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Threads
              </a>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 hover:bg-black/5"
                onClick={async () => {
                  try {
                    await navigator.share?.({ text: result.text, url: result.shareUrl });
                  } catch {}
                }}
              >
                📲 Share
              </button>
            </div>

            <div className="mt-8 text-sm opacity-70">
              Дадзеныя гістарычныя — прыблізныя для гульнёвага супастаўленьня. Дапрашайцеся ўдакладненняў і дасылайце новыя прыклады.
            </div>
          </section>
        ) : null}

        <div className="mt-12 opacity-70 text-sm">Прыклады: {EMIGRANTS.map((p) => p.name).join(", ")}</div>
      </div>
    </main>
  );
}


