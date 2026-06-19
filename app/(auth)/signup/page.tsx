import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">Create Account</div>
          <h1>Join aTz.</h1>
          <p>Create an account with email and password.</p>
          <AuthForm mode="signup" />
          <div className="btn-row">
            <Link className="btn" href="/login" prefetch={false}>Already have an account?</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
