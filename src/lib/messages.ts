import { findNearestByDays, estimateDurationDays } from "@/lib/emigrants";

export type AppLang = "be" | "ru";

function formatNumber(n: number, lang: AppLang): string {
  const locale = lang === "ru" ? "ru-RU" : "be-BY";
  return new Intl.NumberFormat(locale).format(n);
}

function pluralDays(n: number, lang: AppLang): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (lang === "ru") {
    if (mod10 === 1 && mod100 !== 11) return "день";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
    return "дней";
  } else {
    // be: дзень, дні, дзён
    if (mod10 === 1 && mod100 !== 11) return "дзень";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дні";
    return "дзён";
  }
}

export function differenceInDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function buildMessage(startDate: Date, lang: AppLang = "be") {
  const days = differenceInDays(startDate, new Date());
  const nearest = findNearestByDays(days);
  const daysStr = `${formatNumber(days, lang)} ${pluralDays(days, lang)}`;
  const text =
    lang === "ru"
      ? `Ты в эмиграции ${daysStr}, как ${nearest.name}.`
      : `Ты ў эміграцыі ${daysStr}, як ${nearest.name}.`;

  const matchedTotal = estimateDurationDays(nearest);
  const delta = matchedTotal - days;

  let base: string;
  if (lang === "ru") {
    base = `Твоя дорога похожа на ${nearest.name}.`;
  } else {
    base = nearest.blurb;
  }

  let rel: string;
  if (nearest.returned) {
    if (delta > 0) {
      rel =
        lang === "ru"
          ? `По его масштабу возвращение через ${formatNumber(delta, lang)} ${pluralDays(delta, lang)} от сегодня.`
          : `Па яго маштабе вяртаньне праз ${formatNumber(delta, lang)} ${pluralDays(delta, lang)} ад сёньня.`;
    } else if (delta < 0) {
      rel =
        lang === "ru"
          ? `По его масштабу возвращение было ${formatNumber(Math.abs(delta), lang)} ${pluralDays(Math.abs(delta), lang)} назад от сегодня.`
          : `Па яго маштабе вяртаньне было ${formatNumber(Math.abs(delta), lang)} ${pluralDays(Math.abs(delta), lang)} таму ад сёньня.`;
    } else {
      rel = lang === "ru" ? `По его масштабу — как раз сейчас момент возвращения.` : `Па яго маштабе — якраз цяпер момант вяртаньня.`;
    }
  } else {
    const left = Math.max(0, delta);
    rel =
      lang === "ru"
        ? `По его масштабу до такой продолжительности ещё ${formatNumber(left, lang)} ${pluralDays(left, lang)} от сегодня.`
        : `Па яго маштабе да такой працягласьці яшчэ ${formatNumber(left, lang)} ${pluralDays(left, lang)} ад сёньня.`;
  }

  const sub = `${base} ${rel}`.trim();
  const og = `/api/og?q=${encodeURIComponent(text)}&sub=${encodeURIComponent(sub)}`;
  return { days, nearest, text, sub, og };
}


