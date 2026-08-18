import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Caleb Kilemba | Data Engineer & Consultant", template: "%s | Caleb Kilemba" },
  description: "Data engineering, analytics engineering, automation and consulting solutions by Caleb Kilemba."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
