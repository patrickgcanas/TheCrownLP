import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Contador de visitas da Vercel (sem cookies). Só nas páginas públicas, não no painel.
          Fica em Suspense porque lê o endereço da página (exigência do Cache Components). */}
      <Suspense>
        <Analytics />
      </Suspense>
    </>
  );
}
