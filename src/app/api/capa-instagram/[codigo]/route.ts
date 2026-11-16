import type { NextRequest } from "next/server";

// Capa de um post do Instagram servida pelo próprio site. O Instagram bloqueia que outros sites
// mostrem a imagem direto no navegador (Cross-Origin-Resource-Policy), mas entrega para servidores.
// A CDN da Vercel guarda a resposta por um dia, então o Instagram é consultado poucas vezes.
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/capa-instagram/[codigo]">) {
  const { codigo } = await ctx.params;
  if (!/^[A-Za-z0-9_-]{5,40}$/.test(codigo)) {
    return new Response(null, { status: 404 });
  }

  try {
    const res = await fetch(`https://www.instagram.com/p/${codigo}/media/?size=l`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    const tipo = res.headers.get("content-type") ?? "";
    if (!res.ok || !tipo.startsWith("image/")) {
      return new Response(null, { status: 404 });
    }
    return new Response(res.body, {
      headers: {
        "Content-Type": tipo,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
