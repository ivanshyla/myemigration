"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { EMIGRANTS, rankByDays } from "@/lib/emigrants";
import { buildMessage, differenceInDays } from "@/lib/messages";
import { findClosestExtendedProfile, UserContext } from "@/lib/emigrants_extended";
import WindowChrome from "./WindowChrome";
import ArchiveCard from "./ArchiveCard";

type Props = { initialDate?: string };

export default function AppClient({ initialDate }: Props) {
  const [start, setStart] = useState<string>(initialDate || "");
  const [startDay, setStartDay] = useState<string>("");
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const displayCurrentYear = new Date().getFullYear();
  const [activity] = useState("");
  const [reason] = useState("");
  const [where] = useState("");
  // single-card mode; no alternative switching
  const [selectedEmigrantSlug, setSelectedEmigrantSlug] = useState<string | null>(null);
  const [avg, setAvg] = useState<{ count: number; averageDays: number } | null>(null);

  const result = useMemo(() => {
    if (!start) return null;
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return null;
    const userDays = differenceInDays(new Date(start), new Date());
    const rankedNearest = rankByDays(userDays, 10);
    
    // Если выбран конкретный эмигрант, используем его как primary
    let primary = rankedNearest[0];
    let secondary = rankedNearest[1];
    
    // Иногда показываем Рыгора Астапеню как альтернативу
    if (Math.random() < 0.3 && rankedNearest.length > 2) { // 30% вероятность
      const astapenia = rankedNearest.find(e => e.slug === "ryhor-astapenia");
      if (astapenia) {
        secondary = astapenia;
      }
    }
    
    if (selectedEmigrantSlug) {
      const selectedEmigrant = rankedNearest.find(e => e.slug === selectedEmigrantSlug);
      if (selectedEmigrant) {
        primary = selectedEmigrant;
        secondary = rankedNearest.find(e => e.slug !== selectedEmigrantSlug) || rankedNearest[1];
      }
    }
    // Всегда используем реальные дни пользователя для отображения
    const built = buildMessage(startDate, primary, userDays);
    const userCtx: UserContext = {
      freeText: activity,
      tags: undefined,
      locations: where
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    // Отключаем показ расширенных карточек для всех
    const extended = null;
    const search = new URLSearchParams({ d: start }).toString();
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}?${search}` : "";
    return { ...built, shareUrl, extended, secondary };
  }, [start, activity, reason, where, selectedEmigrantSlug]);

  // Send stats when result calculated
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!result) return;
      try {
        await fetch("/api/stats", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ days: result.days }),
        });
        const res = await fetch("/api/stats", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setAvg({ count: data.count, averageDays: data.averageDays });
      } catch {
        if (!cancelled) setAvg(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result?.days]);

  // Загружаем статистику сразу при загрузке страницы, даже если пользователь ещё не ввёл дату
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && typeof data?.count === "number" && typeof data?.averageDays === "number") {
          setAvg({ count: data.count, averageDays: data.averageDays });
        }
      } catch {
        if (!cancelled) setAvg(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);



  // Обновляем основное состояние start при изменении отдельных полей
  useEffect(() => {
    if (startDay && startMonth && startYear) {
      // Ждём, пока год будет полностью введён (4 цифры), чтобы не клампить преждевременно
      if (!/^\d{4}$/.test(startYear)) {
        return;
      }
      const day = startDay.padStart(2, '0');
      const month = startMonth.padStart(2, '0');
      const year = startYear;
      
      // Валидация: год не ранее 1950 и не позже текущего года
      const currentYear = new Date().getFullYear();
      const minYear = 1950;
      const maxYear = currentYear;
      
      if (parseInt(year) < minYear) {
        setStartYear(minYear.toString());
        return;
      }
      if (parseInt(year) > maxYear) {
        setStartYear(maxYear.toString());
        return;
      }
      
      setStart(`${year}-${month}-${day}`);
    }
  }, [startDay, startMonth, startYear]);

  // Инициализируем поля при загрузке
  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate);
      if (!Number.isNaN(date.getTime())) {
        setStartDay(date.getDate().toString());
        setStartMonth((date.getMonth() + 1).toString());
        setStartYear(date.getFullYear().toString());
      }
    }
  }, [initialDate]);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-16">
        <WindowChrome>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">Белэміграцыя</h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg opacity-80">Колькі дзён ты правёў(-ла) ў эміграцыі?</p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div className="w-full sm:w-auto">
              <label className="block text-sm opacity-70 mb-2">Дата адʼезду (1950-{displayCurrentYear})</label>
              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Дз"
                    className="w-16 border border-black/10 rounded-md px-3 py-3 text-center text-base bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                  />
                  <span className="text-xs opacity-60 mt-1">Дзень</span>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Ме"
                    className="w-16 border border-black/10 rounded-md px-3 py-3 text-center text-base bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                  />
                  <span className="text-xs opacity-60 mt-1">Месяц</span>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Год"
                    className="w-20 border border-black/10 rounded-md px-3 py-3 text-center text-base bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                  />
                  <span className="text-xs opacity-60 mt-1">Год</span>
                </div>
              </div>
            </div>
          </div>

        {result ? (
          <section className="mt-10">
            <ArchiveCard
              title={result.text}
              body={result.sub}
              caption={result.nearest?.name || ""}
            />
            
            {/* Альтернативный эмигрант (кликабельная ссылка) - показываем только если есть nearest */}
            {result.nearest && result.secondary ? (
              <div className="mt-6">
                <button 
                  onClick={() => {
                    setSelectedEmigrantSlug(result.secondary.slug);
                  }}
                  className="w-full p-4 rounded-lg border border-black/15 bg-white/50 hover:bg-white/80 transition-colors text-left"
                >
                  <div className="text-sm text-black/60 mb-1">Альбо паглядзіце на:</div>
                  <div className="font-medium text-base">{result.secondary.name}</div>
                  <div className="text-sm text-black/70 mt-1">{result.secondary.blurb}</div>
                </button>
              </div>
            ) : null}
            

            {/* alt archive card removed per request */}

            {/* Кнопки шаринга - показываем только если есть nearest */}
            {result.nearest ? (
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.text)}&url=${encodeURIComponent(result.shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  𝕏 Tweet
                </a>
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
                  href={`https://threads.net/intent/post?text=${encodeURIComponent(result.text)}%20${encodeURIComponent(result.shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Threads
                </a>
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
                  href="/change"
                >
                  Я хачу гэта змяніць
                </a>
                <button
                  className="inline-flex items-center justify-center gap-2 border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      await navigator.share?.({ text: result.text, url: result.shareUrl });
                    } catch {}
                  }}
                >
                  📲 Share
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
                  href="/change"
                >
                  Я хачу гэта змяніць
                </a>
              </div>
            )}

            <div className="mt-6 sm:mt-8 text-xs sm:text-sm opacity-70">
              Дадзеныя гістарычныя — прыблізныя для гульнёвага супастаўленьня. Дапрашайцеся ўдакладненьняў і дасылайце новыя прыклады.
            </div>
          </section>
        ) : null}

        {/* Глобальная статыстыка — в самом низу контента */}
        <div className="mt-10 sm:mt-12">
          {avg ? (
            <div className="w-full sm:w-[420px] rounded-lg border border-black/10 p-4 bg-white/70 text-left">
              <div className="text-sm opacity-70">Сярэдняя лічба для ўсіх людзей, якія прайшлі гэты тэст</div>
              <div className="text-xl font-semibold text-blue-600">{Math.floor(avg.averageDays).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} дзён</div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-sm opacity-70">Колькі нас</div>
                <div className="text-lg font-medium">{avg.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
              </div>
            </div>
          ) : (
            <div className="w-full sm:w-auto text-center sm:text-left">
              <div className="text-sm opacity-60">Загрузка статыстыкі...</div>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col gap-2">
          <div className="opacity-70 text-xs sm:text-sm">Вайб-кодзінг Іван Шыла, 2025</div>
        </div>
        </WindowChrome>
      </div>
    </main>
  );
}


