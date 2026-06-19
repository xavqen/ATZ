 "use client";

import { useEffect, useState } from "react";
import { isSupabaseReady, supabase } from "@/lib/supabase-client";

type Profile = {
  username: string;
  country: string;
  state: string;
  xp: number;
};

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile>({ username: "", country: "", state: "", xp: 0 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!supabase) return;

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setMessage("Please log in to edit your profile.");
        return;
      }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      if (data) {
        setProfile({
          username: data.username || "",
          country: data.country || "",
          state: data.state || "",
          xp: data.xp || 0
        });
      }
    }

    loadProfile();
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        country: profile.country,
        state: profile.state
      })
      .eq("id", user.id);

    setMessage(error ? error.message : "Profile saved successfully.");
  }

  return (
    <>
      <div className="stats">
        <div className="stat"><strong>{profile.xp}</strong><span>Total XP</span></div>
        <div className="stat"><strong>{profile.country || "Not set"}</strong><span>Country</span></div>
        <div className="stat"><strong>{profile.state || "Not set"}</strong><span>State</span></div>
      </div>

      <form className="form" onSubmit={save}>
        <input className="input" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="Username" required />
        <div className="form-grid">
          <input className="input" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="Country" required />
          <input className="input" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} placeholder="State" required />
        </div>
        <button className="btn primary" type="submit">Save Profile</button>
      </form>

      {!isSupabaseReady && <p className="note warn">Supabase keys are missing.</p>}
      {message && <p className="note">{message}</p>}
    </>
  );
}
