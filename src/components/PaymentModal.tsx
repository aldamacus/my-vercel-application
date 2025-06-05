"use client";
import PayPalCheckout from "@/components/PayPalCheckout";

export default function PaymentModal({
  open,
  onClose,
  amount,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
          onClick={onClose}
          aria-label="Close payment window"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
          Secure PayPal Payment
        </h2>
        <div className="mb-4 text-center text-gray-700">
          Please complete your booking by paying{" "}
          <span className="font-bold">€{amount}</span> securely via PayPal.
        </div>
        <PayPalCheckout />
      </div>
    </div>
  );
}
