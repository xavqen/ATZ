export const dynamic = "force-static";

export const metadata = {
  title: "About aTz",
  description: "aTz is a scalable Next.js website using virtualized ad delivery, email/password authentication, and country/state profiles."
};

export default function Page() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">aTz</div>
          <h1>About aTz</h1>
          <p>aTz is a scalable Next.js website using virtualized ad delivery, email/password authentication, and country/state profiles.</p>
          <div className="btn-row">
            <a className="btn primary" href="/">Back to Home</a>
          </div>
        </div>
      </section>
    </main>
  );
}
