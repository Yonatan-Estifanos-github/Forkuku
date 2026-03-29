import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Allura, Playfair_Display, Noto_Sans_Ethiopic } from "next/font/google";
import "./main.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ConditionalUI from "@/components/ConditionalUI";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant"
});
const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura"
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair"
});
const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["300", "400"],
  variable: "--font-ethiopic"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://forkuku.vercel.app'),
  title: "Yonatan & Saron — September 4, 2026",
  description: "The wedding of Yonatan & Saron · September 4, 2026 · Wrightsville, Pennsylvania.",
  openGraph: {
    type: 'website',
    title: "Yonatan & Saron — September 4, 2026",
    description: "The wedding of Yonatan & Saron · September 4, 2026 · Wrightsville, Pennsylvania.",
    images: [
      {
        url: 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Yonatan & Saron',
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} ${allura.variable} ${playfair.variable} ${notoEthiopic.variable} font-sans`}>
        <LanguageProvider>
          <SmoothScroll>
            {/* Conditionally render nav/sound (hidden on admin/login) */}
            <ConditionalUI />

            {children}
          </SmoothScroll>
        </LanguageProvider>

          {/* Global Film Grain Overlay */}
          <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
