"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfileAction, saveProfileAction } from "@/app/actions/profile";
import {
  getMessagesAction,
  addGuestMessageAction,
  type MessageRow,
} from "@/app/actions/messages";
import {
  cancelBookingByGuestAction,
  getBookingsAction,
  requestBookingCancellationByGuestAction,
  type BookingRow,
  updatePaymentReferenceByGuestAction,
} from "@/app/actions/bookings";
import { getPropertyWifiForGuestAction } from "@/app/actions/property-settings";
import {
  User,
  CalendarDays,
  MessageSquare,
  LogOut,
  CheckCircle2,
  Clock,
  Send,
  X,
  KeyRound,
  Wifi,
  DoorOpen,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { AUTH_CHANGE_EVENT, fetchAuthSession } from "@/lib/authClient";
import { signOutAction } from "@/app/actions/auth";
import { setAuthReturnPath } from "@/lib/authRedirect";
import { isAdminEmail } from "@/lib/admin";
import {
  canGuestCancelBooking,
  canGuestEditPaymentReference,
  canGuestRequestCancellation,
  formatBookingStatus,
  type BookingStatus,
} from "@/lib/booking-workflow";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Profile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

function getStatusBadgeClass(status: BookingStatus): string {
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
      return "bg-neutral-100 text-neutral-600";
    case "completed":
      return "bg-emerald-50 text-emerald-700";
  }
}

function getStatusHint(status: BookingStatus): string {
  switch (status) {
    case "new":
      return "Awaiting admin review";
    case "pending":
      return "Add your advance payment reference, then wait for confirmation";
    case "upcoming":
      return "Tap to view access details";
    case "cancellation_requested":
      return "Cancellation request sent to the admin";
    case "cancelled":
      return "This booking was cancelled";
    case "rejected":
      return "This booking was rejected by the admin";
    case "completed":
      return "Your stay is completed";
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProfileForm({ email }: { email: string }) {
  const [profile, setProfile] = useState<Profile>({ firstName: "", lastName: "", phone: "", email });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileAction().then((p) => {
      if (p) setProfile(p);
      setLoading(false);
    });
  }, [email]);

  function handleChange(field: keyof Profile, value: string) {
    setProfile((p) => ({ ...p, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveProfileAction(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputCls =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white transition disabled:opacity-50";

  if (loading) {
    return (
      <div>
        <h2 className="mb-6 text-base font-semibold text-neutral-900">My Profile</h2>
        <div className="flex flex-col gap-4 max-w-lg animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-base font-semibold text-neutral-900">My Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              First name
            </label>
            <input
              type="text"
              placeholder="Jane"
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Last name
            </label>
            <input
              type="text"
              placeholder="Doe"
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className={cn(inputCls, "cursor-not-allowed opacity-60")}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600">
            Phone number
          </label>
          <input
            type="tel"
            placeholder="+40 700 000 000"
            value={profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 active:scale-[0.98]"
          >
            Save changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 size={14} />
              Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy-to-clipboard pill
// ---------------------------------------------------------------------------
function CopyField({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
        <span className="text-neutral-500">{icon}</span>
        <span className="flex-1 font-mono text-sm font-semibold tracking-widest text-neutral-900">{value}</span>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 transition"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking details modal (upcoming only)
// ---------------------------------------------------------------------------
function BookingModal({
  booking,
  onClose,
}: {
  booking: BookingRow;
  onClose: () => void;
}) {
  const [wifi, setWifi] = useState<{ wifiSsid: string; wifiPassword: string } | null>(null);
  const [wifiLoading, setWifiLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setWifiLoading(true);
    getPropertyWifiForGuestAction().then((w) => {
      if (cancelled) return;
      setWifi(w ?? { wifiSsid: "", wifiPassword: "" });
      setWifiLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const statusLabel = formatBookingStatus(booking.status);
  const entrance = booking.entranceCode.trim();
  const notes = booking.hostNotes.trim();
  const wifiSsid = (wifi?.wifiSsid ?? "").trim();
  const wifiPassword = (wifi?.wifiPassword ?? "").trim();
  const hasAccessDetails =
    Boolean(entrance) ||
    Boolean(notes) ||
    Boolean(wifiSsid) ||
    Boolean(wifiPassword);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={booking.image}
          alt={booking.apartment}
          className="h-36 w-full rounded-t-2xl object-cover"
        />

        <div className="p-5">
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{booking.apartment}</p>
                <p className="text-xs text-neutral-500">{booking.location}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                  getStatusBadgeClass(booking.status)
                )}
              >
                {statusLabel}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div>
                <span className="text-neutral-400">Check-in</span>
                <p className="font-medium text-neutral-700">{booking.checkIn}</p>
              </div>
              <div>
                <span className="text-neutral-400">Check-out</span>
                <p className="font-medium text-neutral-700">{booking.checkOut}</p>
              </div>
            </div>
          </div>

          {wifiLoading ? (
            <div className="flex items-center gap-2 py-4 text-sm text-neutral-400">
              <Loader2 size={14} className="animate-spin" /> Loading access details…
            </div>
          ) : hasAccessDetails ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Access details
              </p>
              {entrance ? (
                <CopyField label="Entrance code" value={entrance} icon={<DoorOpen size={14} />} />
              ) : null}
              {wifiSsid ? (
                <CopyField label="Wi-Fi network" value={wifiSsid} icon={<Wifi size={14} />} />
              ) : null}
              {wifiPassword ? (
                <CopyField label="Wi-Fi password" value={wifiPassword} icon={<KeyRound size={14} />} />
              ) : null}
              {!wifiSsid && !wifiPassword && (entrance || notes) ? (
                <p className="text-xs text-neutral-500">
                  Wi-Fi details will appear here once the host has added them.
                </p>
              ) : null}
              {notes ? (
                <div className="mt-1 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3.5 py-3 text-xs leading-relaxed text-neutral-600">
                  <p className="mb-1 font-semibold text-neutral-700">Notes from host</p>
                  {notes}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              Access details will appear here once the host has set them up.
            </p>
          )}

          <p className="mt-4 text-center text-[11px] text-neutral-400">
            Booking #{booking.id} · {booking.nights} nights · {booking.total}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking card
// ---------------------------------------------------------------------------
function BookingCard({
  booking,
  onClick,
  children,
}: {
  booking: BookingRow;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const upcomingLike =
    booking.status === "upcoming" ||
    booking.status === "cancellation_requested";
  const Wrapper = upcomingLike ? "button" : "div";
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <Wrapper
        {...(upcomingLike ? { onClick, type: "button" as const } : {})}
        className={cn(
          "w-full text-left",
          upcomingLike &&
            "cursor-pointer transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.995]"
        )}
      >
        <div className="flex flex-col sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.image}
            alt={booking.apartment}
            className="h-40 w-full object-cover sm:h-auto sm:w-36 sm:shrink-0"
          />
          <div className="flex flex-1 flex-col justify-between gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{booking.apartment}</p>
                <p className="text-xs text-neutral-500">{booking.location}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    getStatusBadgeClass(booking.status)
                  )}
                >
                  {formatBookingStatus(booking.status)}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {getStatusHint(booking.status)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div>
                <span className="text-neutral-400">Check-in</span>
                <p className="font-medium text-neutral-700">{booking.checkIn}</p>
              </div>
              <div>
                <span className="text-neutral-400">Check-out</span>
                <p className="font-medium text-neutral-700">{booking.checkOut}</p>
              </div>
              <div>
                <span className="text-neutral-400">Nights</span>
                <p className="font-medium text-neutral-700">{booking.nights}</p>
              </div>
              <div>
                <span className="text-neutral-400">Total</span>
                <p className="font-medium text-neutral-700">{booking.total}</p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">Booking #{booking.id}</p>
          </div>
        </div>
      </Wrapper>
      {children ? <div className="border-t border-neutral-100 bg-neutral-50 p-4">{children}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bookings panel
// ---------------------------------------------------------------------------
function BookingsPanel() {
  const [allBookings, setAllBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, string>>({});
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<Record<string, string>>({});

  useEffect(() => {
    getBookingsAction().then((rows) => {
      setAllBookings(rows);
      setPaymentDrafts(
        Object.fromEntries(rows.map((row) => [row.id, row.paymentReference]))
      );
      setLoading(false);
    });
  }, []);

  function replaceBooking(updated: BookingRow) {
    setAllBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setPaymentDrafts((prev) => ({ ...prev, [updated.id]: updated.paymentReference }));
    if (selectedBooking?.id === updated.id) {
      setSelectedBooking(updated);
    }
  }

  async function runBookingAction(
    bookingId: string,
    action: () => Promise<{ ok: boolean; error?: string; booking?: BookingRow }>
  ) {
    setBusyBookingId(bookingId);
    setBookingError((prev) => ({ ...prev, [bookingId]: "" }));
    const result = await action();
    setBusyBookingId(null);
    if (!result.ok) {
      setBookingError((prev) => ({
        ...prev,
        [bookingId]: result.error ?? "Could not update booking.",
      }));
      return;
    }
    if (result.booking) replaceBooking(result.booking);
  }

  const newBookings = allBookings.filter((b) => b.status === "new");
  const pendingBookings = allBookings.filter((b) => b.status === "pending");
  const upcomingBookings = allBookings.filter((b) => b.status === "upcoming");
  const cancellationRequestedBookings = allBookings.filter(
    (b) => b.status === "cancellation_requested"
  );
  const historyBookings = allBookings.filter((b) =>
    ["completed", "cancelled", "rejected"].includes(b.status)
  );

  return (
    <div>
      <h2 className="mb-6 text-base font-semibold text-neutral-900">My Bookings</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 size={14} className="animate-spin" /> Loading bookings…
        </div>
      ) : allBookings.length === 0 ? (
        <p className="text-sm text-neutral-400">No bookings yet. Reserve your stay to get started.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {newBookings.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-500" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">New</span>
              </div>
              {newBookings.map((b) => (
                <BookingCard key={b.id} booking={b}>
                  <div className="flex flex-wrap items-center gap-2">
                    {canGuestCancelBooking(b.status) && (
                      <button
                        type="button"
                        disabled={busyBookingId === b.id}
                        onClick={() =>
                          runBookingAction(b.id, () =>
                            cancelBookingByGuestAction(b.id)
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {busyBookingId === b.id ? "Updating…" : "Cancel booking"}
                      </button>
                    )}
                  </div>
                  {bookingError[b.id] ? (
                    <p className="mt-2 text-xs text-red-600">{bookingError[b.id]}</p>
                  ) : null}
                </BookingCard>
              ))}
            </>
          )}
          {pendingBookings.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-500" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending payment</span>
              </div>
              {pendingBookings.map((b) => (
                <BookingCard key={b.id} booking={b}>
                  <div className="space-y-3">
                    {canGuestEditPaymentReference(b.status) && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-600">
                          Advance payment reference
                        </label>
                        <textarea
                          rows={3}
                          value={paymentDrafts[b.id] ?? ""}
                          onChange={(e) =>
                            setPaymentDrafts((prev) => ({
                              ...prev,
                              [b.id]: e.target.value,
                            }))
                          }
                          className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                          placeholder="Transaction ID, payment note, or transfer reference"
                        />
                        <p className="mt-1 text-[11px] text-neutral-500">
                          Add the reference you used for the advance payment so the admin can confirm it.
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      {canGuestEditPaymentReference(b.status) && (
                        <button
                          type="button"
                          disabled={busyBookingId === b.id}
                          onClick={() =>
                            runBookingAction(b.id, () =>
                              updatePaymentReferenceByGuestAction(
                                b.id,
                                paymentDrafts[b.id] ?? ""
                              )
                            )
                          }
                          className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
                        >
                          {busyBookingId === b.id ? "Saving…" : "Save payment reference"}
                        </button>
                      )}
                      {canGuestCancelBooking(b.status) && (
                        <button
                          type="button"
                          disabled={busyBookingId === b.id}
                          onClick={() =>
                            runBookingAction(b.id, () =>
                              cancelBookingByGuestAction(b.id)
                            )
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {busyBookingId === b.id ? "Updating…" : "Cancel booking"}
                        </button>
                      )}
                    </div>
                    {bookingError[b.id] ? (
                      <p className="text-xs text-red-600">{bookingError[b.id]}</p>
                    ) : null}
                  </div>
                </BookingCard>
              ))}
            </>
          )}
          {upcomingBookings.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Upcoming</span>
              </div>
              {upcomingBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onClick={() => setSelectedBooking(b)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {canGuestRequestCancellation(b.status) && (
                      <button
                        type="button"
                        disabled={busyBookingId === b.id}
                        onClick={() =>
                          runBookingAction(b.id, () =>
                            requestBookingCancellationByGuestAction(b.id)
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {busyBookingId === b.id ? "Sending…" : "Request cancellation"}
                      </button>
                    )}
                  </div>
                  {bookingError[b.id] ? (
                    <p className="mt-2 text-xs text-red-600">{bookingError[b.id]}</p>
                  ) : null}
                </BookingCard>
              ))}
            </>
          )}
          {cancellationRequestedBookings.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-red-500" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Cancellation requested
                </span>
              </div>
              {cancellationRequestedBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onClick={() => setSelectedBooking(b)}
                >
                  <p className="text-xs text-neutral-600">
                    The admin has been notified. Your booking remains active until the cancellation is approved.
                  </p>
                  {bookingError[b.id] ? (
                    <p className="mt-2 text-xs text-red-600">{bookingError[b.id]}</p>
                  ) : null}
                </BookingCard>
              ))}
            </>
          )}
          {historyBookings.length > 0 && (
            <>
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-neutral-400" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Past bookings</span>
              </div>
              {historyBookings.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </>
          )}
        </div>
      )}

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

function MessagesPanel() {
  const [msgs, setMsgs] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessagesAction().then((rows) => {
      setMsgs(rows);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    const sent = await addGuestMessageAction(draft.trim());
    if (sent.ok) setMsgs((prev) => [...prev, sent.row]);
    setDraft("");
    setSending(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
          C
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">Central am Brukenthal</p>
          <p className="text-xs text-neutral-400">Host · Sibiu, Romania</p>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3 min-h-0 max-h-[420px]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-400">
            <Loader2 size={14} className="animate-spin" /> Loading messages…
          </div>
        ) : (
          msgs.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex flex-col gap-1", msg.from === "guest" && "items-end")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.from === "guest"
                    ? "bg-neutral-900 text-white"
                    : "bg-white border border-neutral-200 text-neutral-800"
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

      {/* Compose */}
      <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Write a message…"
          value={draft}
          disabled={sending}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:opacity-40"
          aria-label="Send message"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Tab = "profile" | "bookings" | "messages";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "My Profile", icon: <User size={16} /> },
  { id: "bookings", label: "Bookings", icon: <CalendarDays size={16} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={16} /> },
];

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof fetchAuthSession>
  > | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    fetchAuthSession().then((s) => {
      if (!s) {
        setAuthReturnPath("/profile");
        router.replace("/sign-in");
        return;
      }
      if (isAdminEmail(s.email)) {
        router.replace("/admin");
        return;
      }
      setSession(s);
      setReady(true);
    });

    const handler = () => {
      fetchAuthSession().then((updated) => {
        if (!updated) {
          setAuthReturnPath("/profile");
          router.replace("/sign-in");
        } else if (isAdminEmail(updated.email)) router.replace("/admin");
        else setSession(updated);
      });
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, [router]);

  async function handleSignOut() {
    await signOutAction();
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    router.push("/");
    router.refresh();
  }

  if (!ready || !session) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 md:py-12">

        {/* ---- Left sidebar ---- */}
        <aside className="w-full shrink-0 md:w-56">
          {/* Avatar + name */}
          <div className="mb-6 flex items-center gap-3 md:flex-col md:items-start md:gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white ring-4 ring-white shadow-sm">
              {session.email[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {session.email}
              </p>
              <p className="text-xs text-neutral-400">Guest</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex gap-1 md:flex-col">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition md:flex-none md:w-full",
                  tab === item.id
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                )}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 md:mt-6"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </aside>

        {/* ---- Right content ---- */}
        <main className="min-w-0 flex-1 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {tab === "profile" && <ProfileForm email={session.email} />}
          {tab === "bookings" && <BookingsPanel />}
          {tab === "messages" && <MessagesPanel />}
        </main>
      </div>
    </div>
  );
}
