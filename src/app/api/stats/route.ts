import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { kv } from "@vercel/kv";

type Stats = { count: number; totalDays: number };

const DATA_DIR = path.join(process.cwd(), "data");
const STATS_PATH = path.join(DATA_DIR, "stats.json");

async function readStats(): Promise<Stats> {
  try {
    // Если есть Vercel KV (продакшен) — используем его
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const [count, totalDays] = await Promise.all([
        kv.get<number>("stats:count"),
        kv.get<number>("stats:totalDays"),
      ]);
      return { count: Number(count) || 0, totalDays: Number(totalDays) || 0 };
    }
    const buf = await fs.readFile(STATS_PATH, "utf8");
    const parsed = JSON.parse(buf) as Stats;
    if (
      typeof parsed !== "object" ||
      typeof parsed.count !== "number" ||
      typeof parsed.totalDays !== "number"
    )
      throw new Error("invalid");
    return parsed;
  } catch {
    return { count: 0, totalDays: 0 };
  }
}

async function writeStats(s: Stats): Promise<void> {
  // Пишем в KV, если доступен, иначе — в файл (локальная разработка)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await Promise.all([
      kv.set("stats:count", s.count),
      kv.set("stats:totalDays", s.totalDays),
    ]);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STATS_PATH, JSON.stringify(s), "utf8");
}

export async function GET() {
  const s = await readStats();
  const avg = s.count > 0 ? Math.round(s.totalDays / s.count) : 0;
  return new Response(
    JSON.stringify({ count: s.count, totalDays: s.totalDays, averageDays: avg }),
    { headers: { "content-type": "application/json" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { days?: unknown };
    const days = Number(body.days);
    // Валидация: от 0 до условного большого предела (100k дней ~ 274 года)
    if (!Number.isFinite(days) || days < 0 || days > 100000) {
      return new Response(JSON.stringify({ error: "invalid days" }), { status: 400 });
    }
    // Daily unique guard based on cookie uid
    const cookieName = "me_uid";
    let uid = req.cookies.get(cookieName)?.value;
    let setCookieHeader: string | null = null;
    if (!uid) {
      uid = crypto.randomUUID();
      // 1 year
      setCookieHeader = `${cookieName}=${uid}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    }

    // If KV доступен, используем ключ с TTL сутки и NX, чтобы не инкрементировать повторно
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const today = new Date();
      const y = today.getUTCFullYear();
      const m = String(today.getUTCMonth() + 1).padStart(2, "0");
      const d = String(today.getUTCDate()).padStart(2, "0");
      const seenKey = `stats:seen:${uid}:${y}${m}${d}`;
      // nx: true — только если ключ не существует; ex: сутки
      const setRes = await kv.set(seenKey, "1", { ex: 60 * 60 * 24, nx: true });
      const current = await readStats();
      let next = current;
      if (setRes === "OK") {
        next = { count: current.count + 1, totalDays: current.totalDays + Math.round(days) };
        await writeStats(next);
      }
      const avg = next.count > 0 ? Math.round(next.totalDays / next.count) : 0;
      const headers = new Headers({ "content-type": "application/json" });
      if (setCookieHeader) headers.append("Set-Cookie", setCookieHeader);
      return new Response(
        JSON.stringify({ count: next.count, totalDays: next.totalDays, averageDays: avg }),
        { headers }
      );
    }

    // Файловый режим (локально): инкрементируем всегда
    const prev = await readStats();
    const next: Stats = { count: prev.count + 1, totalDays: prev.totalDays + Math.round(days) };
    await writeStats(next);
    const avg = Math.round(next.totalDays / next.count);
    const headers = new Headers({ "content-type": "application/json" });
    if (setCookieHeader) headers.append("Set-Cookie", setCookieHeader);
    return new Response(
      JSON.stringify({ count: next.count, totalDays: next.totalDays, averageDays: avg }),
      { headers }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad request" }), { status: 400 });
  }
}



