import "server-only";

function escapeHtml(texto: string) {
  return texto.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Avisa a banda por e-mail (Resend). Sem RESEND_API_KEY/ADMIN_EMAIL configurados, não faz nada.
export async function avisarBanda({
  assunto,
  titulo,
  linhas,
  link,
}: {
  assunto: string;
  titulo: string;
  linhas: [string, string | null | undefined][];
  link: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const para = process.env.ADMIN_EMAIL;
  if (!apiKey || !para) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`;
  const corpo = linhas
    .filter(([, valor]) => valor)
    .map(
      ([rotulo, valor]) =>
        `<p style="margin:0 0 12px"><strong style="color:#8e2a9e">${escapeHtml(rotulo)}:</strong><br>${escapeHtml(valor!).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d0f22">
      <h2 style="margin:0 0 16px;color:#d63fb8">${escapeHtml(titulo)}</h2>
      ${corpo}
      <p style="margin:24px 0 0"><a href="${siteUrl}${link}" style="background:#d63fb8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Abrir no painel</a></p>
      <p style="margin:24px 0 0;font-size:12px;color:#888">The Crown LP — Heavy is the Crown</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? "The Crown LP <onboarding@resend.dev>",
        to: [para],
        subject: assunto,
        html,
      }),
    });
    if (!res.ok) console.error("Aviso por e-mail falhou:", res.status, await res.text());
  } catch (error) {
    console.error("Aviso por e-mail falhou:", error);
  }
}
