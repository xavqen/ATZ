export const dynamic = "force-static";

export const metadata = {
  title: "Privacy Policy",
  description: "aTz stores account profile data in Supabase when authentication is configured. Third-party ads may have their own privacy policies."
};

export default function Page() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">aTz</div>
          <h1>Privacy Policy</h1>
          <p>aTz stores account profile data in Supabase when authentication is configured. Third-party ads may have their own privacy policies.</p>
          <div className="btn-row">
            <a className="btn primary" href="/">Back to Home</a>
          </div>
        </div>
      </section>
    </main>
  );
}
