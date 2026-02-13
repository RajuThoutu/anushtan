import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import fonts (we will need to check if globals.css is correct)
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Anushtan Admin Portal",
    description: "Administrative portal for Anushtan Indic School",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${playfair.className}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
