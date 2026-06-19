import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "aTz",
    template: "%s | aTz"
  },
  description: "Next.js App Router website with virtualized ads, auto scrolling, Supabase auth, and efficient ad loading.",
  icons: {
    icon: "./favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="footer">© 2026 aTz · Virtualized Ads · Supabase Auth · Next.js App Router</footer>
      </body>
    </html>
  );
}
