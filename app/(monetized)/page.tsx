import Link from "next/link";
import { VirtualizedAdWall } from "@/components/ads/VirtualizedAdWall";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="stack">
      <VirtualizedAdWall pageName="Home" />

      <section className="hero-grid content-after-ads">
        <div className="card">
          <div className="card-inner">
            <div className="kicker">aTz · Scalable Ads</div>
            <h1>One million ad slots without browser crashes.</h1>
            <p>The platform uses virtualization, batched GPT refreshes, strict lazy loading, and auto scrolling at half a page per second.</p>
            <div className="btn-row">
              <Link className="btn primary" href="/a" prefetch>Open Page A</Link>
              <Link className="btn" href="/signup" prefetch={false}>Create Account</Link>
              <Link className="btn" href="/login" prefetch={false}>Log In</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div className="kicker">Architecture</div>
            <h2>Only a tiny render window is kept alive.</h2>
            <p>Instead of rendering one million live iframes, the DOM recycles a small visible window while the user scrolls.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
