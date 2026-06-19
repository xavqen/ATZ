import Link from "next/link";
import { LETTERS } from "@/lib/ads";

function Icon({ name }: { name: "home" | "trophy" | "user" | "info" | "shield" | "file" | "login" }) {
  const paths = {
    home: ["M3 11l9-8 9 8", "M5 10v10h14V10", "M9 20v-6h6v6"],
    trophy: ["M8 21h8", "M12 17v4", "M7 4h10v4a5 5 0 0 1-10 0V4z", "M7 6H4a3 3 0 0 0 3 3", "M17 6h3a3 3 0 0 1-3 3"],
    user: ["M20 21a8 8 0 0 0-16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"],
    info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20", "M12 16v-4", "M12 8h.01"],
    shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"],
    file: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M8 13h8", "M8 17h5"],
    login: ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"]
  };

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name].map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <nav className="navbar">
        <Link className="logo" href="/" prefetch>
          <span className="logo-mark"><span>aTz</span></span>
          <span className="brand-name">aTz</span>
        </Link>

        <div className="nav-wrap">
          <div className="nav-main">
            <Link className="nav-icon" href="/" prefetch title="Home"><Icon name="home" /></Link>
            <Link className="nav-icon" href="/leaderboard" prefetch={false} title="Leaderboard"><Icon name="trophy" /></Link>
            <Link className="nav-icon" href="/profile" prefetch={false} title="Profile"><Icon name="user" /></Link>
            <Link className="nav-icon" href="/about" prefetch title="About"><Icon name="info" /></Link>
            <Link className="nav-icon" href="/privacy" prefetch title="Privacy"><Icon name="shield" /></Link>
            <Link className="nav-icon" href="/terms" prefetch title="Terms"><Icon name="file" /></Link>
            <Link className="nav-icon" href="/login" prefetch={false} title="Log in"><Icon name="login" /></Link>
          </div>

          <div className="nav-pages">
            {LETTERS.map((letter) => <Link key={letter} href={`/${letter}`} prefetch>{letter}</Link>)}
          </div>
        </div>

        <div className="header-user">
          <span className="xp-pill">0 XP</span>
          <Link className="user-avatar" href="/profile" prefetch={false}><Icon name="user" /></Link>
        </div>
      </nav>
    </header>
  );
}
