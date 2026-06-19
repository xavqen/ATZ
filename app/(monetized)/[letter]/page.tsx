import Link from "next/link";
import { notFound } from "next/navigation";
import { VirtualizedAdWall } from "@/components/ads/VirtualizedAdWall";
import { LETTERS } from "@/lib/ads";

export const dynamic = "force-static";

export function generateStaticParams() {
  return LETTERS.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  return {
    title: `Page ${letter.toUpperCase()}`,
    description: `aTz Page ${letter.toUpperCase()} with virtualized ads and static rendering.`
  };
}

export default async function LetterPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  if (!LETTERS.includes(letter)) notFound();

  return (
    <main className="stack">
      <VirtualizedAdWall pageName={`Page ${letter.toUpperCase()}`} />

      <section className="card content-after-ads">
        <div className="card-inner center">
          <div className="kicker">Page {letter.toUpperCase()}</div>
          <div className="page-letter">{letter}</div>
          <p>This page is statically generated. Use the links below to move between all A-Z pages.</p>
          <div className="quick-links">
            {LETTERS.filter((item) => item !== letter).map((item) => (
              <Link key={item} href={`/${item}`} prefetch>{item}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
