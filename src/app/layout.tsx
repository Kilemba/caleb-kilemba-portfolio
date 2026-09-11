import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/**
 * Poppins gives the rounded geometric feel of the reference design. next/font downloads
 * and self-hosts it at build time, so there is no request to Google at runtime and no
 * layout shift while it loads.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: { default: "Caleb Kilemba | Data Engineer & Consultant", template: "%s | Caleb Kilemba" },
  description: "Data engineering, analytics engineering, automation and consulting solutions by Caleb Kilemba."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
