import type { Metadata } from "next";
import { Tajawal, Manrope } from "next/font/google";
import { AuthProvider } from "@/components/providers/session-provider";
import "@/app/globals.css";

const arabic = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsApp Ordering System",
  description: "Multi-tenant WhatsApp ordering SaaS for Lebanese small shops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${arabic.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
