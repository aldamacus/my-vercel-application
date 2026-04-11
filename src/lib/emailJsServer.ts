const SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

export type EmailJsConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string;
};

export function getEmailJsConfig(): EmailJsConfig | null {
  const serviceId =
    process.env.EMAILJS_SERVICE_ID?.trim() ??
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim();
  const templateId =
    process.env.EMAILJS_TEMPLATE_ID?.trim() ??
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY?.trim() ??
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return null;
  }
  return { serviceId, templateId, publicKey, privateKey };
}

export async function sendEmailJsTemplate(
  templateParams: Record<string, string>,
  cfg: EmailJsConfig
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: cfg.serviceId,
      template_id: cfg.templateId,
      user_id: cfg.publicKey,
      accessToken: cfg.privateKey,
      template_params: templateParams,
    }),
  });
  return { ok: res.ok, status: res.status };
}
