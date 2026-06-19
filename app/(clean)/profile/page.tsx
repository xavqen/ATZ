import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">Profile</div>
          <h1>Your profile.</h1>
          <p>Update your username, country, and state for leaderboard ranking.</p>
          <ProfileForm />
        </div>
      </section>
    </main>
  );
}
