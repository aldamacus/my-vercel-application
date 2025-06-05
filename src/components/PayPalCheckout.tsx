"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalCheckout() {
  return (
    <PayPalScriptProvider options={{ clientId: "test" }}>
      <div className="flex flex-col items-center py-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Pay with PayPal
        </h2>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(_data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "EUR",
                    value: "10.00", // Example amount
                  },
                },
              ],
              intent: "CAPTURE",
              application_context: {
                shipping_preference: "NO_SHIPPING", // No shipping for digital goods
              },
            });
          }}
          onApprove={(_data, actions) => {
            if (!actions.order) {
              return Promise.resolve();
            }
            return actions.order.capture().then((details) => {
              // Defensive: check for payer and name
              const givenName = details?.payer?.name?.given_name || "";
              alert("Transaction completed by " + givenName);
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
