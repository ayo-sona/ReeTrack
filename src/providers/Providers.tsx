"use client";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryProvider } from "./QueryProvider";
import { PaystackProvider } from "./PaymentProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HeroUIProvider>
        <QueryProvider>
          <PaystackProvider>{children}</PaystackProvider>
        </QueryProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
