import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // O endereço antigo da Vercel leva para o domínio próprio (um endereço só para o Google).
  // /api fica de fora: o despertador do Supabase (GitHub Actions) chama thecrownlp.vercel.app/api/manter-ativo.
  async redirects() {
    return [
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: "thecrownlp.vercel.app" }],
        destination: "https://www.thecrownlp.com.br/:path",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
