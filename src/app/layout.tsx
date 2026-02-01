import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Allura, Playfair_Display } from "next/font/google";
import "./main.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ConditionalUI from "@/components/ConditionalUI";

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

export const metadata: Metadata = {
  title: "Estifanos Wedding",
  description: "Wedding celebration website",
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
      <body className={`${inter.variable} ${cormorant.variable} ${allura.variable} ${playfair.variable} font-sans`}>
        <SmoothScroll>
          {/* Conditionally render nav/sound (hidden on admin/login) */}
          <ConditionalUI />

          {children}
        </SmoothScroll>

        {/* Global Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
