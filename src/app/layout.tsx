import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Títulos: Inter Tight, a fonte livre mais parecida com a escrita do Linkin Park na fase "From Zero"
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// A imagem da prévia ao compartilhar o link (WhatsApp, Instagram...) é src/app/opengraph-image.jpg
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Crown LP — Tributo a Linkin Park",
  description:
    "The Crown LP é uma banda tributo a Linkin Park. Heavy is the Crown. Contrate para bares, eventos privados e apresentações públicas.",
  openGraph: {
    siteName: "The Crown LP",
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
