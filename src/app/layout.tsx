import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/Providers";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "ReeTrack - Community and Payment Management",
  description: "Manage your community and payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
        <GoogleAnalytics gaId="G-NFCEF78QJN" />
      </body>
    </html>
  );
}
