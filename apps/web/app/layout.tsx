import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anushtan Indic School",
  description: "An institution of timeless wisdom and modern learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(playfair.variable, inter.variable)}>
      <body className="antialiased min-h-screen flex flex-col font-body">
        {children}
      </body>
    </html>
  );
}
