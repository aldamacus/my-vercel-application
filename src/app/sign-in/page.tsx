"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignIn from "@/components/SignIn";
import { AUTH_CHANGE_EVENT, fetchAuthSession } from "@/lib/authClient";
import { getPostAuthHref, safeNextPath } from "@/lib/authRedirect";

function SignInGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof fetchAuthSession>
  > | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetchAuthSession().then((s) => {
      setSession(s);
      setHydrated(true);
    });
    const handler = () => fetchAuthSession().then(setSession);
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!hydrated || !session) return;
    const next = safeNextPath(searchParams.get("next"));
    router.replace(next ?? getPostAuthHref({ email: session.email }));
  }, [hydrated, session, router, searchParams]);

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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-neutral-50 px-4">
          <div className="h-64 w-full max-w-sm animate-pulse rounded-2xl bg-neutral-200/80" />
        </main>
      }
    >
      <SignInGate />
    </Suspense>
  );
}
