"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Loader2,
  MessageSquare,
  Send,
  LogOut,
} from "lucide-react";
import { AUTH_CHANGE_EVENT, fetchAuthSession } from "@/lib/authClient";
import { signOutAction } from "@/app/actions/auth";
import { isAdminEmail } from "@/lib/admin";
import { cn } from "@/lib/utils";
import {
  completeBookingByAdminAction,
  confirmBookingPaymentByAdminAction,
  getAllBookingsForAdminAction,
  listGuestEmailsForAdminAction,
  markBookingPendingByAdminAction,
  rejectBookingByAdminAction,
  resolveCancellationRequestByAdminAction,
  type AdminBookingRow,
  updateBookingAdminDetailsAction,
} from "@/app/actions/bookings";
import {
  getPropertyWifiAdminAction,
  setPropertyWifiAction,
} from "@/app/actions/property-settings";
import {
  getGuestMessagesForAdminAction,
  addHostMessageForGuestAction,
  type MessageRow,
} from "@/app/actions/messages";
import {
  canAdminCompleteBooking,
  canAdminConfirmUpcoming,
  canAdminMoveToPending,
  canAdminRejectBooking,
  canAdminResolveCancellation,
  formatBookingStatus,
} from "@/lib/booking-workflow";

type Tab = "bookings" | "messages";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [actorEmail, setActorEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("bookings");

  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editTotal, setEditTotal] = useState("");
  const [editEntrance, setEditEntrance] = useState("");
  const [editHostNotes, setEditHostNotes] = useState("");
  const [editInternalComment, setEditInternalComment] = useState("");
  const [savingBookingDetails, setSavingBookingDetails] = useState(false);
  const [runningStatusAction, setRunningStatusAction] = useState<string | null>(
    null
  );
  const [bookingError, setBookingError] = useState("");

  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiLoading, setWifiLoading] = useState(true);
  const [savingWifi, setSavingWifi] = useState(false);

  const [guestEmails, setGuestEmails] = useState<string[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<MessageRow[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAuthSession().then((s) => {
      if (!s || !isAdminEmail(s.email)) {
        router.replace("/");
        return;
      }
      setActorEmail(s.email);
      setReady(true);
    });

    const handler = () => {
      fetchAuthSession().then((next) => {
        if (!next || !isAdminEmail(next.email)) {
          router.replace("/");
          return;
        }
        setActorEmail(next.email);
      });
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, [router]);

  useEffect(() => {
    if (!actorEmail) return;
    setBookingsLoading(true);
    getAllBookingsForAdminAction().then((res) => {
      if (res.ok && res.bookings) setBookings(res.bookings);
      setBookingsLoading(false);
    });
  }, [actorEmail]);

  useEffect(() => {
    if (!actorEmail) return;
    setWifiLoading(true);
    getPropertyWifiAdminAction().then((res) => {
      if (res.ok) {
        setWifiSsid(res.wifiSsid ?? "");
        setWifiPassword(res.wifiPassword ?? "");
      }
      setWifiLoading(false);
    });
  }, [actorEmail]);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) {
      setEditTotal("");
      setEditEntrance("");
      setEditHostNotes("");
      setEditInternalComment("");
      return;
    }
    setEditTotal(selected.total);
    setEditEntrance(selected.entranceCode);
    setEditHostNotes(selected.hostNotes);
    setEditInternalComment(selected.adminInternalComment);
    setBookingError("");
  }, [selected]);

  useEffect(() => {
    if (!actorEmail || tab !== "messages") return;
    listGuestEmailsForAdminAction().then((res) => {
      if (res.ok && res.emails) {
        setGuestEmails(res.emails);
        setSelectedGuest((prev) =>
          prev && res.emails!.includes(prev) ? prev : res.emails![0] ?? null
        );
      }
    });
  }, [actorEmail, tab]);

  useEffect(() => {
    if (!selectedGuest) {
      setMsgs([]);
      return;
    }
    setMsgsLoading(true);
    getGuestMessagesForAdminAction(selectedGuest).then((rows) => {
      setMsgs(rows);
      setMsgsLoading(false);
    });
  }, [selectedGuest]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function replaceBooking(updated: AdminBookingRow) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  async function handleSaveBookingDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!actorEmail || !selectedId) return;
    setSavingBookingDetails(true);
    setBookingError("");
    const res = await updateBookingAdminDetailsAction(selectedId, {
      total: editTotal,
      entranceCode: editEntrance,
      hostNotes: editHostNotes,
      adminInternalComment: editInternalComment,
    });
    setSavingBookingDetails(false);
    if (!res.ok) {
      setBookingError(res.error ?? "Could not save.");
      return;
    }
    if (res.booking) replaceBooking(res.booking);
  }

  async function runStatusAction(
    actionKey: string,
    callback: () => Promise<{ ok: boolean; error?: string; booking?: AdminBookingRow }>
  ) {
    setRunningStatusAction(actionKey);
    setBookingError("");
    const res = await callback();
    setRunningStatusAction(null);
    if (!res.ok) {
      setBookingError(res.error ?? "Could not update status.");
      return;
    }
    if (res.booking) replaceBooking(res.booking);
  }

  async function handleSaveWifi(e: React.FormEvent) {
    e.preventDefault();
    if (!actorEmail) return;
    setSavingWifi(true);
    await setPropertyWifiAction({
      wifiSsid,
      wifiPassword,
    });
    setSavingWifi(false);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGuest || !draft.trim() || sending) return;
    setSending(true);
    const sent = await addHostMessageForGuestAction(selectedGuest, draft.trim());
    if (sent.ok) setMsgs((prev) => [...prev, sent.row]);
    setDraft("");
    setSending(false);
  }

  async function handleSignOut() {
    await signOutAction();
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    router.push("/");
    router.refresh();
  }

  function getStatusBadgeClass(status: AdminBookingRow["status"]) {
    switch (status) {
      case "new":
        return "bg-amber-50 text-amber-700";
      case "pending":
        return "bg-orange-50 text-orange-700";
      case "upcoming":
        return "bg-blue-50 text-blue-700";
      case "cancellation_requested":
        return "bg-red-50 text-red-700";
      case "cancelled":
      case "rejected":
        return "bg-neutral-200 text-neutral-700";
      case "completed":
        return "bg-emerald-50 text-emerald-700";
    }
  }

  if (!ready || !actorEmail) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 md:py-12">
        <aside className="w-full shrink-0 md:w-56">
          <div className="mb-6 flex items-center gap-3 md:flex-col md:items-start md:gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white ring-4 ring-white shadow-sm">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                Admin
              </p>
              <p className="text-xs text-neutral-400 truncate">{actorEmail}</p>
            </div>
          </div>

          <nav className="flex gap-1 md:flex-col">
            <button
              type="button"
              onClick={() => setTab("bookings")}
              className={cn(
                "flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition md:flex-none md:w-full",
                tab === "bookings"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              )}
            >
              <CalendarDays size={16} />
              <span className="hidden sm:inline">Bookings</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("messages")}
              className={cn(
                "flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition md:flex-none md:w-full",
                tab === "messages"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              )}
            >
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Messages</span>
            </button>
          </nav>

          <Link
            href="/"
            className="mt-4 block w-full rounded-lg px-3 py-2.5 text-center text-sm font-medium text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-900 md:mt-6"
          >
            Back to site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          {tab === "bookings" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h1 className="mb-6 text-lg font-semibold text-neutral-900">
                Bookings & access
              </h1>

              <section className="mb-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <h2 className="mb-3 text-sm font-semibold text-neutral-800">
                  Property Wi‑Fi (all guests)
                </h2>
                {wifiLoading ? (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Loader2 size={14} className="animate-spin" /> Loading…
                  </div>
                ) : (
                  <form onSubmit={handleSaveWifi} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="min-w-[160px] flex-1">
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Network name (SSID)
                      </label>
                      <input
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                      />
                    </div>
                    <div className="min-w-[160px] flex-1">
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Wi‑Fi password
                      </label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingWifi}
                      className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
                    >
                      {savingWifi ? "Saving…" : "Save Wi‑Fi"}
                    </button>
                  </form>
                )}
              </section>

              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="min-w-0 flex-1 overflow-x-auto">
                  <h2 className="mb-3 text-sm font-semibold text-neutral-800">
                    All reservations
                  </h2>
                  {bookingsLoading ? (
                    <div className="flex items-center gap-2 py-8 text-sm text-neutral-400">
                      <Loader2 size={14} className="animate-spin" /> Loading bookings…
                    </div>
                  ) : bookings.length === 0 ? (
                    <p className="text-sm text-neutral-500">No bookings yet.</p>
                  ) : (
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
                          <th className="py-2 pr-3">Guest</th>
                          <th className="py-2 pr-3">Stay</th>
                          <th className="py-2 pr-3">Status</th>
                          <th className="py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr
                            key={b.id}
                            className={cn(
                              "cursor-pointer border-b border-neutral-100 transition hover:bg-neutral-50",
                              selectedId === b.id && "bg-neutral-100"
                            )}
                            onClick={() => setSelectedId(b.id)}
                          >
                            <td className="max-w-[140px] truncate py-2.5 pr-3 text-neutral-800">
                              {b.userEmail}
                            </td>
                            <td className="whitespace-nowrap py-2.5 pr-3 text-neutral-600">
                              {b.checkIn} → {b.checkOut}
                            </td>
                            <td className="py-2.5 pr-3">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-xs font-medium",
                                  getStatusBadgeClass(b.status)
                                )}
                              >
                                {formatBookingStatus(b.status)}
                              </span>
                            </td>
                            <td className="py-2.5 text-neutral-700">{b.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="w-full shrink-0 lg:w-80">
                  <h2 className="mb-3 text-sm font-semibold text-neutral-800">
                    Edit booking
                  </h2>
                  {!selected ? (
                    <p className="text-sm text-neutral-500">
                      Select a row to update workflow, guest instructions, internal comments, and access details.
                    </p>
                  ) : (
                    <form
                      onSubmit={handleSaveBookingDetails}
                      className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                    >
                      <p className="truncate text-xs text-neutral-500">{selected.userEmail}</p>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Current status
                        </label>
                        <div
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            getStatusBadgeClass(selected.status)
                          )}
                        >
                          {formatBookingStatus(selected.status)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-neutral-200 bg-white p-3">
                        <p className="mb-2 text-xs font-medium text-neutral-600">
                          Workflow actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {canAdminMoveToPending(selected.status) && (
                            <button
                              type="button"
                              disabled={runningStatusAction !== null}
                              onClick={() =>
                                runStatusAction("pending", () =>
                                  markBookingPendingByAdminAction(selected.id)
                                )
                              }
                              className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
                            >
                              {runningStatusAction === "pending"
                                ? "Updating…"
                                : "Move to pending"}
                            </button>
                          )}
                          {canAdminRejectBooking(selected.status) && (
                            <button
                              type="button"
                              disabled={runningStatusAction !== null}
                              onClick={() =>
                                runStatusAction("rejected", () =>
                                  rejectBookingByAdminAction(selected.id)
                                )
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              {runningStatusAction === "rejected"
                                ? "Updating…"
                                : "Reject booking"}
                            </button>
                          )}
                          {canAdminConfirmUpcoming(
                            selected.status,
                            selected.paymentReference
                          ) && (
                            <button
                              type="button"
                              disabled={runningStatusAction !== null}
                              onClick={() =>
                                runStatusAction("upcoming", () =>
                                  confirmBookingPaymentByAdminAction(selected.id)
                                )
                              }
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                            >
                              {runningStatusAction === "upcoming"
                                ? "Updating…"
                                : "Confirm payment"}
                            </button>
                          )}
                          {canAdminResolveCancellation(selected.status) && (
                            <>
                              <button
                                type="button"
                                disabled={runningStatusAction !== null}
                                onClick={() =>
                                  runStatusAction("cancelled", () =>
                                    resolveCancellationRequestByAdminAction(
                                      selected.id,
                                      "cancelled"
                                    )
                                  )
                                }
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                {runningStatusAction === "cancelled"
                                  ? "Updating…"
                                  : "Approve cancellation"}
                              </button>
                              <button
                                type="button"
                                disabled={runningStatusAction !== null}
                                onClick={() =>
                                  runStatusAction("restore-upcoming", () =>
                                    resolveCancellationRequestByAdminAction(
                                      selected.id,
                                      "upcoming"
                                    )
                                  )
                                }
                                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
                              >
                                {runningStatusAction === "restore-upcoming"
                                  ? "Updating…"
                                  : "Keep as upcoming"}
                              </button>
                            </>
                          )}
                          {canAdminCompleteBooking(selected.status) && (
                            <button
                              type="button"
                              disabled={runningStatusAction !== null}
                              onClick={() =>
                                runStatusAction("completed", () =>
                                  completeBookingByAdminAction(selected.id)
                                )
                              }
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                            >
                              {runningStatusAction === "completed"
                                ? "Updating…"
                                : "Mark completed"}
                            </button>
                          )}
                        </div>
                        {selected.status === "pending" &&
                        !selected.paymentReference.trim() ? (
                          <p className="mt-2 text-xs text-orange-600">
                            Waiting for the guest to add a payment reference before you can confirm the booking.
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Guest payment reference
                        </label>
                        <textarea
                          value={selected.paymentReference}
                          readOnly
                          rows={3}
                          className="w-full resize-y rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Total
                        </label>
                        <input
                          value={editTotal}
                          onChange={(e) => setEditTotal(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Entrance code
                        </label>
                        <input
                          value={editEntrance}
                          onChange={(e) => setEditEntrance(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Guest instructions
                        </label>
                        <textarea
                          value={editHostNotes}
                          onChange={(e) => setEditHostNotes(e.target.value)}
                          rows={4}
                          className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Internal admin comments
                        </label>
                        <textarea
                          value={editInternalComment}
                          onChange={(e) => setEditInternalComment(e.target.value)}
                          rows={4}
                          className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                        />
                      </div>
                      {bookingError ? (
                        <p className="text-xs text-red-600">{bookingError}</p>
                      ) : null}
                      <button
                        type="submit"
                        disabled={savingBookingDetails}
                        className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
                      >
                        {savingBookingDetails ? "Saving…" : "Save details"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "messages" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h1 className="mb-6 text-lg font-semibold text-neutral-900">
                Guest messages
              </h1>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Guest
                </label>
                <select
                  value={selectedGuest ?? ""}
                  onChange={(e) => setSelectedGuest(e.target.value || null)}
                  className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                >
                  {guestEmails.length === 0 ? (
                    <option value="">No guests yet</option>
                  ) : (
                    guestEmails.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 min-h-[280px] max-h-[420px] overflow-y-auto">
                {msgsLoading ? (
                  <div className="flex flex-1 items-center justify-center gap-2 py-8 text-sm text-neutral-400">
                    <Loader2 size={14} className="animate-spin" /> Loading…
                  </div>
                ) : !selectedGuest ? (
                  <p className="text-sm text-neutral-500">Select a guest to view the thread.</p>
                ) : (
                  msgs.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1",
                        msg.from === "host" && "items-end"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                          msg.from === "host"
                            ? "bg-neutral-900 text-white"
                            : "border border-neutral-200 bg-white text-neutral-800"
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-neutral-400 px-1">{msg.time}</span>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply as host…"
                  value={draft}
                  disabled={!selectedGuest || sending}
                  onChange={(e) => setDraft(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!selectedGuest || !draft.trim() || sending}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:opacity-40"
                  aria-label="Send"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
