import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/Providers";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "ReeTrack - Community and Payment Management",
  description: "Manage your community and payments",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PostHogProvider>
          <Providers>
            <Suspense>
              <PostHogPageView />
            </Suspense>
            {children}
            <Toaster
              theme="dark"
              position="top-right"
              toastOptions={{
                style: {
                  background: "#111113",
                  border: "1px solid #1C1C1F",
                  color: "#FAFAFA",
                },
              }}
            />
          </Providers>
        </PostHogProvider>
        <GoogleAnalytics gaId="G-NFCEF78QJN" />
        <Analytics />
      </body>
    </html>
  );
}
