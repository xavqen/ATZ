 "use client";

import { useState } from "react";
import { isSupabaseReady, supabase } from "@/lib/supabase-client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const username = String(form.get("username") || "");
    const country = String(form.get("country") || "");
    const state = String(form.get("state") || "");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : "Logged in successfully.");
      if (!error) setTimeout(() => { window.location.href = "/profile"; }, 700);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, country, state } }
      });
      setMessage(error ? error.message : "Account created successfully.");
      if (!error) setTimeout(() => { window.location.href = "/profile"; }, 900);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`
    });

    setMessage(error ? error.message : "Password reset email sent.");
  }

  return (
    <>
      <form className="form" onSubmit={submit}>
        {mode === "signup" && (
          <input className="input" name="username" type="text" placeholder="Username" minLength={3} required />
        )}

        <input className="input" name="email" type="email" placeholder="Email address" required />

        {mode !== "forgot" && (
          <input className="input" name="password" type="password" placeholder="Password" minLength={6} required />
        )}

        {mode === "signup" && (
          <div className="form-grid">
            <input className="input" name="country" type="text" placeholder="Country, for example India" required />
            <input className="input" name="state" type="text" placeholder="State, for example Jharkhand" required />
          </div>
        )}

        <button className="btn primary" type="submit">
          {mode === "login" ? "Log In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
        </button>
      </form>

      {!isSupabaseReady && <p className="note warn">Supabase keys are missing.</p>}
      {message && <p className="note">{message}</p>}
    </>
  );
}
