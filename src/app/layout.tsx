import type { Metadata } from "next";
import { Inter, Crimson_Text, Roboto_Mono } from "next/font/google";
import { CartProvider } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

// Used by the /collections/space page's `.ac-*` UI (filter chips, badges,
// collection pill, trust bar) — the live site loads this exact family for
// those elements via Google Fonts.
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Premium Science & Space Posters – Arte Collective",
  description:
    "Arte Collective brings science and space into your home through modern, design-driven posters. From the mysteries of black holes to the beauty of Saturn's rings, transform your walls into a gallery of knowledge and imagination. Perfect for contemporary interiors and curious minds. Shop now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${crimsonText.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
