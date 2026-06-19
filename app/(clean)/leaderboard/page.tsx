export const dynamic = "force-static";

export const metadata = {
  title: "Leaderboard",
  description: "Clean leaderboard page without the heavy ad wall."
};

export default function LeaderboardPage() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">Leaderboard</div>
          <h1>Global, country, and state rankings.</h1>
          <p>This page intentionally stays clean and does not render the one-million ad wall.</p>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Rank</th><th>User</th><th>XP</th><th>Country</th><th>State</th></tr></thead>
              <tbody><tr><td>#1</td><td>Demo User</td><td>120 XP</td><td>India</td><td>Jharkhand</td></tr></tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
