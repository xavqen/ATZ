
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";
import { ADS } from "./ad-config.js";

const ready = SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("PASTE_") && !SUPABASE_ANON_KEY.includes("PASTE_");
const supabase = ready ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const today = () => new Date().toISOString().slice(0, 10);
const pageName = () => (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "home";

function toast(message, type = "note") {
  let box = $("#toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-box";
    box.style.cssText = "position:fixed;left:14px;bottom:14px;z-index:9999;display:grid;gap:8px;max-width:min(390px,calc(100% - 28px))";
    document.body.appendChild(box);
  }

  const item = document.createElement("div");
  item.className = type === "error" ? "note err" : type === "warn" ? "note warn" : "note";
  item.textContent = message;
  box.appendChild(item);
  setTimeout(() => item.remove(), 4200);
}

function loadScript(src, parent = document.body, attrs = {}) {
  if (!src) return;
  const script = document.createElement("script");
  script.src = src;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  parent.appendChild(script);
}

function bannerSrcDoc(config) {
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=${config.width}, initial-scale=1">
<style>
html,body{margin:0;padding:0;width:${config.width}px;height:${config.height}px;overflow:hidden;background:transparent;}
body{display:flex;align-items:flex-start;justify-content:center;}
</style>
</head>
<body>
<script>
window.atOptions = {
  key: '${config.key}',
  format: 'iframe',
  height: ${config.height},
  width: ${config.width},
  params: {}
};
<\/script>
<script src="${config.src}"><\/script>
</body>
</html>`;
}

function nativeSrcDoc() {
  const id = ADS.nativeBanner.containerId;
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html,body{margin:0;padding:0;overflow:hidden;background:transparent;color:#fff;font-family:Arial,sans-serif;}
#${id}{width:100%;min-height:200px;}
</style>
</head>
<body>
<div id="${id}"></div>
<script async data-cfasync="false" src="${ADS.nativeBanner.src}"><\/script>
</body>
</html>`;
}

function scaleAdFrame(card) {
  const frame = card.querySelector(".ad-frame");
  const stage = card.querySelector(".ad-stage");
  if (!frame || !stage) return;

  const width = Number(card.dataset.width || 320);
  const height = Number(card.dataset.height || 90);
  const available = stage.clientWidth || width;
  const scale = Math.min(1, available / width);

  frame.style.transform = `scale(${scale})`;
  stage.style.height = `${Math.ceil(height * scale)}px`;
}

function initBanner(card) {
  const size = card.dataset.size;
  const config = ADS.banners[size];
  if (!config) return;

  card.dataset.width = config.width;
  card.dataset.height = config.height;
  card.style.setProperty("--adw", `${config.width}px`);
  card.style.setProperty("--adh", `${config.height}px`);

  const stage = card.querySelector(".ad-stage");
  if (!stage) return;

  stage.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.className = "ad-frame";
  iframe.width = config.width;
  iframe.height = config.height;
  iframe.scrolling = "no";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.sandbox = "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin";
  iframe.srcdoc = bannerSrcDoc(config);

  stage.appendChild(iframe);
  scaleAdFrame(card);
  setTimeout(() => scaleAdFrame(card), 500);
}

function initNative(card) {
  const stage = card.querySelector(".ad-stage");
  if (!stage || !ADS.nativeBanner?.src) return;

  stage.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.className = "ad-frame";
  iframe.width = "100%";
  iframe.height = "220";
  iframe.scrolling = "no";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.sandbox = "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin";
  iframe.srcdoc = nativeSrcDoc();

  stage.appendChild(iframe);
}

function initAds() {
  setTimeout(() => loadScript(ADS.popunder), 1200);
  setTimeout(() => loadScript(ADS.socialBar), 1800);

  $$(".ad-card[data-size]").forEach(initBanner);
  $$(".ad-card[data-native='true']").forEach(initNative);

  $$(".smartlink").forEach((link) => {
    link.href = ADS.smartlink || "#";
    link.target = "_blank";
    link.rel = "nofollow sponsored noopener";
  });

  window.addEventListener("resize", () => $$(".ad-card").forEach(scaleAdFrame), { passive: true });
}

function initMenu() {
  const button = $(".menu-btn");
  const nav = $(".nav-wrap");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("open"))
  );
}

async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function getProfile() {
  const session = await getSession();
  if (!session) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return data;
}

async function renderAuth() {
  const session = await getSession();
  const profile = session ? await getProfile() : null;

  $$(".auth-guest").forEach((el) => (el.style.display = session ? "none" : ""));
  $$(".auth-user").forEach((el) => (el.style.display = session ? "" : "none"));

  $$(".xp-total").forEach((el) => (el.textContent = String(profile?.xp || 0)));
  $$(".profile-name").forEach((el) => (el.textContent = profile?.username || session?.user?.email || "Guest"));
  $$(".profile-country").forEach((el) => (el.textContent = profile?.country || "Not set"));
  $$(".profile-state").forEach((el) => (el.textContent = profile?.state || "Not set"));

  const setup = $("#setup-warning");
  if (setup) setup.style.display = ready ? "none" : "";
}

async function earnXp(type, key = "") {
  if (!supabase) return;

  const session = await getSession();
  if (!session) return;

  const eventKey = key || `${type}:${pageName()}:${today()}`;
  const { data, error } = await supabase.rpc("earn_xp", {
    p_event_type: type,
    p_page: pageName(),
    p_event_key: eventKey
  });

  if (!error && data?.awarded_xp > 0) {
    toast(`+${data.awarded_xp} XP earned`);
    await renderAuth();
  }
}

function initXp() {
  earnXp("page_visit");

  let readDone = false;
  setTimeout(() => {
    if (!readDone) {
      readDone = true;
      earnXp("read_60s");
    }
  }, 60000);

  let scrollDone = false;
  window.addEventListener("scroll", () => {
    if (scrollDone) return;

    const max = document.documentElement.scrollHeight - innerHeight;
    const percent = max <= 0 ? 100 : (scrollY / max) * 100;

    if (percent >= 75) {
      scrollDone = true;
      earnXp("scroll_75");
    }
  }, { passive: true });

  $$("#daily-checkin").forEach((button) =>
    button.addEventListener("click", () => earnXp("daily_checkin", `daily_checkin:${today()}`))
  );
}

async function initForms() {
  const signup = $("#signup-form");
  if (signup) {
    signup.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!supabase) return toast("Please paste your Supabase keys first.", "warn");

      const email = $("#signup-email").value.trim();
      const password = $("#signup-password").value;
      const username = $("#signup-username").value.trim();
      const country = $("#signup-country").value.trim();
      const state = $("#signup-state").value.trim();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, country, state } }
      });

      if (error) return toast(error.message, "error");

      toast("Your account has been created.");
      setTimeout(() => (location.href = "profile.html"), 1000);
    });
  }

  const login = $("#login-form");
  if (login) {
    login.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!supabase) return toast("Please paste your Supabase keys first.", "warn");

      const { error } = await supabase.auth.signInWithPassword({
        email: $("#login-email").value.trim(),
        password: $("#login-password").value
      });

      if (error) return toast(error.message, "error");

      toast("You are logged in.");
      setTimeout(() => (location.href = "profile.html"), 800);
    });
  }

  const forgot = $("#forgot-form");
  if (forgot) {
    forgot.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!supabase) return toast("Please paste your Supabase keys first.", "warn");

      const { error } = await supabase.auth.resetPasswordForEmail($("#forgot-email").value.trim(), {
        redirectTo: location.origin + "/profile.html"
      });

      if (error) return toast(error.message, "error");

      toast("A password reset email has been sent.");
    });
  }

  const profileForm = $("#profile-form");
  if (profileForm) {
    const profile = await getProfile();

    if (profile) {
      $("#profile-username").value = profile.username || "";
      $("#profile-country").value = profile.country || "";
      $("#profile-state").value = profile.state || "";
    }

    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const session = await getSession();
      if (!session) return;

      const payload = {
        username: $("#profile-username").value.trim(),
        country: $("#profile-country").value.trim(),
        state: $("#profile-state").value.trim()
      };

      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", session.user.id);

      if (error) return toast(error.message, "error");

      await earnXp("profile_complete", "profile_complete");
      toast("Your profile has been saved.");
      await renderAuth();
    });
  }

  $$("#logout-btn").forEach((button) =>
    button.addEventListener("click", async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
      location.href = "index.html";
    })
  );
}

async function protectPage() {
  if (!document.body.dataset.protected || !supabase) return;

  const session = await getSession();
  if (!session) location.href = "login.html";
}

async function loadLeaderboard() {
  const body = $("#leaderboard-body");
  if (!body || !supabase) return;

  const country = ($("#filter-country")?.value || "").trim();
  const state = ($("#filter-state")?.value || "").trim();

  let query = supabase
    .from("profiles")
    .select("username,xp,country,state")
    .order("xp", { ascending: false })
    .limit(100);

  if (country) query = query.ilike("country", country);
  if (state) query = query.ilike("state", state);

  const { data, error } = await query;

  if (error) {
    body.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
    return;
  }

  body.innerHTML =
    (data || [])
      .map(
        (row, index) => `<tr>
          <td>#${index + 1}</td>
          <td>${escapeHtml(row.username || "User")}</td>
          <td>${row.xp || 0} XP</td>
          <td>${escapeHtml(row.country || "-")}</td>
          <td>${escapeHtml(row.state || "-")}</td>
        </tr>`
      )
      .join("") || `<tr><td colspan="5">No users found.</td></tr>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initLeaderboardFilters() {
  const apply = $("#apply-filter");
  const clear = $("#clear-filter");

  if (apply) apply.addEventListener("click", loadLeaderboard);

  if (clear) {
    clear.addEventListener("click", () => {
      $("#filter-country").value = "";
      $("#filter-state").value = "";
      loadLeaderboard();
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initMenu();
  initAds();
  await protectPage();
  await renderAuth();
  await initForms();
  await loadLeaderboard();
  initLeaderboardFilters();
  initXp();

  if (supabase) supabase.auth.onAuthStateChange(() => renderAuth());
});
