"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import {
  Eye,
  EyeOff,
  MailCheck,
  CheckCircle2,
  UserCircle2,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { registerAction, confirmAction, signInAction } from "@/app/actions/auth";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";

function sendRegistrationEmails(userEmail: string, token: string) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
  const confirmUrl = `${window.location.origin}/?confirm=${token}`;

  // Notify admin
  emailjs.send(serviceId, templateId, {
    to_email: ADMIN_EMAIL,
    name: "New registration",
    email: userEmail,
    message: `A new user has registered: ${userEmail}\n\nConfirmation link:\n${confirmUrl}`,
  }, publicKey).catch(() => {/* best-effort */});

  // Send confirmation link to the user
  emailjs.send(serviceId, templateId, {
    to_email: userEmail,
    name: "Guest",
    email: userEmail,
    message: `Welcome! Please confirm your email address by clicking the link below:\n\n${confirmUrl}\n\nIf you did not create an account, you can safely ignore this email.`,
  }, publicKey).catch(() => {/* best-effort */});
}

// ---------------------------------------------------------------------------
// Session helpers (client-side only — stores email after server validates creds)
// ---------------------------------------------------------------------------

export interface Session {
  email: string;
}

const SESSION_KEY = "auth_session";
export const AUTH_CHANGE_EVENT = "auth-change";

export function getSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed";

const btnPrimary =
  "w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

// ---------------------------------------------------------------------------
// Inline centered form
// ---------------------------------------------------------------------------

type View = "signin" | "register" | "pending_confirmation" | "confirmed";

export default function SignIn() {
  const router = useRouter();
  const [view, setView] = useState<View>("signin");
  const [session, setSession] = useState<Session | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    setSession(getSession());
    const handler = () => setSession(getSession());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, []);

  // Auto-confirm when the user clicks the link in their email (?confirm=TOKEN)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("confirm");
    if (!token) return;

    // Clean the param from the URL without a page reload
    const clean = new URL(window.location.href);
    clean.searchParams.delete("confirm");
    window.history.replaceState({}, "", clean.toString());

    confirmAction(token).then((result) => {
      if (result.ok) {
        setView("confirmed");
      } else {
        setError(result.error ?? "Confirmation link is invalid or already used.");
      }
    });
  }, []);

  function resetForm() {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setShowPw(false);
    setError("");
  }

  function switchView(v: View) {
    setView(v);
    resetForm();
  }

  // ---- Register (DB) ----
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await registerAction(
      email.trim().toLowerCase(),
      password,
      firstName.trim(),
      lastName.trim()
    );
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error!);
      return;
    }

    const confirmedEmail = email.trim().toLowerCase();
    const token = result.token!;
    
    setPendingEmail(confirmedEmail);
    sendRegistrationEmails(confirmedEmail, token);
    resetForm();
    setView("pending_confirmation");
  }



  // ---- Sign In (DB) ----
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await signInAction(email.trim().toLowerCase(), password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error!);
      return;
    }

    saveSession({ email: result.email! });
    setSession({ email: result.email! });
    resetForm();

    if (isAdminEmail(result.email)) {
      router.push("/admin");
      return;
    }

    // If the user was redirected here after trying to reserve, send them back
    if (sessionStorage.getItem("pending_reserve_dates")) {
      router.push("/book-your-stay");
    }
  }

  // ---- Sign Out ----
  function handleSignOut() {
    saveSession(null);
    setSession(null);
    switchView("signin");
  }

  // ---------------------------------------------------------------------------
  // Signed-in card
  // ---------------------------------------------------------------------------
  if (session) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-8 py-10 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-2xl font-bold text-white ring-4 ring-neutral-100">
          {session.email[0].toUpperCase()}
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-neutral-900">Welcome back!</p>
          <p className="mt-1 text-sm text-neutral-500">{session.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2 text-sm text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form card
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Tabs */}
      {(view === "signin" || view === "register") && (
        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => switchView("signin")}
            className={cn(
              "flex-1 py-3.5 text-sm font-medium transition",
              view === "signin"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            )}
          >
            Sign in
          </button>
          <button
            onClick={() => switchView("register")}
            className={cn(
              "flex-1 py-3.5 text-sm font-medium transition",
              view === "register"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            )}
          >
            Create account
          </button>
        </div>
      )}

      <div className="p-6">
        {/* ---- Sign In ---- */}
        {view === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="si-email">
                Email
              </label>
              <input
                id="si-email"
                type="email"
                autoComplete="email"
                required
                disabled={submitting}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="si-pw">
                Password
              </label>
              <div className="relative">
                <input
                  id="si-pw"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputCls, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}
            <button type="submit" disabled={submitting} className={cn(btnPrimary, "mt-1")}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Sign in
            </button>
          </form>
        )}

        {/* ---- Register ---- */}
        {view === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="reg-first">
                  First name
                </label>
                <input
                  id="reg-first"
                  type="text"
                  autoComplete="given-name"
                  required
                  disabled={submitting}
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="reg-last">
                  Last name
                </label>
                <input
                  id="reg-last"
                  type="text"
                  autoComplete="family-name"
                  required
                  disabled={submitting}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                disabled={submitting}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="reg-pw">
                Password{" "}
                <span className="font-normal text-neutral-400">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <input
                  id="reg-pw"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={submitting}
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputCls, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}
            <button type="submit" disabled={submitting} className={cn(btnPrimary, "mt-1")}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Create account
            </button>
          </form>
        )}

        {/* ---- Pending confirmation ---- */}
        {view === "pending_confirmation" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <MailCheck size={22} className="text-neutral-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Thank you for registering!</p>
              <p className="mt-1 text-xs text-neutral-500">
                The <span className="font-medium text-neutral-700">Central am Brukenthal</span> team
                will send a confirmation link to{" "}
                <span className="font-medium text-neutral-700">{pendingEmail}</span>.
                Please check your email to activate your account.
              </p>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={() => switchView("signin")}
              className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600 transition"
            >
              Back to sign in
            </button>
          </div>
        )}

        {/* ---- Confirmed ---- */}
        {view === "confirmed" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={22} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Account confirmed!</p>
              <p className="mt-1 text-xs text-neutral-500">
                Your account is active. You can now sign in.
              </p>
            </div>
            <button onClick={() => switchView("signin")} className={btnPrimary}>
              Sign in now
            </button>
          </div>
        )}
      </div>

      {(view === "signin" || view === "register") && (
        <div className="flex items-center justify-center gap-1.5 border-t border-neutral-50 py-3">
          <UserCircle2 size={13} className="text-neutral-300" />
          <span className="text-[11px] text-neutral-400">
            Secured · data stored in the cloud
          </span>
        </div>
      )}
    </div>
  );
}
