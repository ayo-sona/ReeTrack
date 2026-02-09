import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ReeTrack Inc",
  description: "Manage your subscriptions and payments",
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
      </body>
    </html>
  );
}
