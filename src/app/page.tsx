import AppClient from "./_components/AppClient";
import { AppLang, buildMessage } from "@/lib/messages";
import type { Metadata, ResolvingMetadata } from "next";

type Props = { searchParams: Promise<{ d?: string; l?: AppLang }>; };

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { d, l } = await searchParams;
  if (!d) return {};
  const startDate = new Date(d);
  if (Number.isNaN(startDate.getTime())) return {};
  const lang = l === "ru" ? "ru" : "be";
  const built = buildMessage(startDate, lang);
  return {
    openGraph: {
      title: built.text,
      description: built.sub,
      images: [{ url: `/api/og?q=${encodeURIComponent(built.text)}&sub=${encodeURIComponent(built.sub)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: built.text,
      description: built.sub,
      images: [`/api/og?q=${encodeURIComponent(built.text)}&sub=${encodeURIComponent(built.sub)}`],
    },
  };
}

export default async function Home(props: Props) {
  const { d, l } = await props.searchParams;
  const initialDate = d && !Number.isNaN(new Date(d).getTime()) ? d : undefined;
  const initialLang: AppLang | undefined = l === "ru" ? "ru" : "be";
  return <AppClient initialDate={initialDate} initialLang={initialLang} />;
}
