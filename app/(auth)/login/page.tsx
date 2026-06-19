import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">Log In</div>
          <h1>Welcome back.</h1>
          <p>Log in with your email and password.</p>
          <AuthForm mode="login" />
          <div className="btn-row">
            <Link className="btn" href="/signup" prefetch={false}>Create Account</Link>
            <Link className="btn" href="/forgot" prefetch={false}>Forgot Password?</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
