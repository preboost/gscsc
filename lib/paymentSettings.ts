export interface PaymentGateway {
  id: "bkash" | "nagad" | "rocket" | "cod";
  name: string;
  enabled: boolean;
  accountType: "Personal" | "Merchant" | "Agent";
  number: string;
  fee: string;
  instructions?: string;
}

export interface PaymentSettings {
  gateways: PaymentGateway[];
  globalNote?: string;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  gateways: [
    {
      id: "bkash",
      name: "bKash",
      enabled: true,
      accountType: "Personal",
      number: "01956477266",
      fee: "100 BDT",
      instructions: "Send 100 BDT via bKash Send Money to Personal Number and enter Transaction ID (TrxID) below.",
    },
    {
      id: "nagad",
      name: "Nagad",
      enabled: true,
      accountType: "Personal",
      number: "01956477266",
      fee: "100 BDT",
      instructions: "Send 100 BDT via Nagad Send Money to Personal Number and enter Transaction ID (TrxID) below.",
    },
    {
      id: "rocket",
      name: "Rocket",
      enabled: true,
      accountType: "Personal",
      number: "01956477266",
      fee: "100 BDT",
      instructions: "Send 100 BDT via Rocket Send Money to Personal Number and enter Transaction ID (TrxID) below.",
    },
    {
      id: "cod",
      name: "Cash on Spot (COD)",
      enabled: true,
      accountType: "Personal",
      number: "",
      fee: "100 BDT",
      instructions: "Pay 100 BDT registration fee in cash at the GSCSC Club Room / Registration Booth during orientation.",
    },
  ],
  globalNote: "Official GSCSC Registration Fee",
};

export function getPaymentSettings(): PaymentSettings {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_payment_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.gateways)) {
          return parsed;
        }
      }
    } catch {}
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

export function savePaymentSettings(settings: PaymentSettings) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_payment_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event("gscsc_payment_settings_updated"));
    } catch (err) {
      console.error("Failed to save payment settings:", err);
    }
  }
}
