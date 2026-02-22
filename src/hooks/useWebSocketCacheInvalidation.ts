import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to listen for WebSocket cache invalidation events
 * and automatically invalidate React Query cache
 */
export function useWebSocketCacheInvalidation() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCacheInvalidation = (event: CustomEvent) => {
      const { queryKey } = event.detail;
      queryClient.invalidateQueries({ queryKey });
    };

    // Add event listener
    window.addEventListener(
      "websocket:invalidate-cache",
      handleCacheInvalidation as EventListener,
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "websocket:invalidate-cache",
        handleCacheInvalidation as EventListener,
      );
    };
  }, [queryClient]);
}
