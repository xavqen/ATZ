import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Reset Password" };

export default function ForgotPage() {
  return (
    <main className="stack clean-page">
      <section className="card">
        <div className="card-inner">
          <div className="kicker">Reset Password</div>
          <h1>Reset your password.</h1>
          <p>Enter your email address to receive a reset link.</p>
          <AuthForm mode="forgot" />
        </div>
      </section>
    </main>
  );
}
