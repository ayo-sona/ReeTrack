"use client";

import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

// Custom hook to safely handle client-side only rendering
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true, // client-side: always return true
    () => false // server-side: always return false
  );
}

export function ThemeToggle() {
  const mounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button isIconOnly variant="light" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}