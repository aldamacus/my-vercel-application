"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmAction } from "@/app/actions/auth";
import { AUTH_CHANGE_EVENT } from "@/lib/authClient";
import { AUTH_CONFIRM_ERROR_KEY, getPostAuthHref } from "@/lib/authRedirect";

export function EmailConfirmationHandler() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("confirm");
    if (!token) return;

    setConfirming(true);
    const clean = new URL(window.location.href);
    clean.searchParams.delete("confirm");
    window.history.replaceState({}, "", clean.toString());

    confirmAction(token).then((result) => {
      setConfirming(false);
      if (result.ok && result.email) {
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
        router.replace(getPostAuthHref({ email: result.email }));
        router.refresh();
        return;
      }
      sessionStorage.setItem(
        AUTH_CONFIRM_ERROR_KEY,
        result.error ?? "Confirmation link is invalid or already used."
      );
      router.replace("/sign-in");
    });
  }, [router]);

  if (!confirming) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-50">
      <p className="text-sm font-medium text-neutral-600">Confirming your account…</p>
    </div>
  );
}
