"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignIn, { getSession, AUTH_CHANGE_EVENT } from "@/components/SignIn";
import { getPostAuthHref } from "@/lib/authRedirect";

export default function SignInPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
    const handler = () => setSession(getSession());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!hydrated || !session) return;
    router.replace(getPostAuthHref());
  }, [hydrated, session, router]);

  if (!hydrated) return null;

  if (session) return null;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-neutral-50 px-4 py-16">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-neutral-900">Your account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sign in or create an account to manage your bookings.
        </p>
      </div>
      <SignIn />
    </main>
  );
}
