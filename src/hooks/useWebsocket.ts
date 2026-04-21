// Client-side WebSocket usage example

import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

interface SubscriptionEvents {
  "plan:upgraded": (data: { newPlan: string; timestamp: string }) => void;
  "plan:downgraded": (data: { newPlan: string; timestamp: string }) => void;
  "plan:expired": (data: { fallbackPlan: string; timestamp: string }) => void;
  "subscription:status_changed": (data: {
    subscriptionId: string;
    status: string;
    metadata?: any;
    timestamp: string;
  }) => void;
  "payment:success": (data: {
    subscriptionId: string;
    amount: number;
    currency: string;
    memberName: string;
    timestamp: string;
  }) => void;
  "payment:failed": (data: {
    subscriptionId: string;
    amount: number;
    currency: string;
    reason: string;
    timestamp: string;
  }) => void;
  "payment:reminder": (data: {
    subscriptionId: string;
    memberName: string;
    amount: number;
    currency: string;
    dueDate: string;
    timestamp: string;
  }) => void;
  "member:joined": (data: any) => void;
  "member_subscription:created": (data: {
    subscription: any;
    invoice: any;
    member: any;
    plan: any;
    timestamp: string;
  }) => void;
  "member_subscription:updated": (data: any) => void;
  "member_subscription:cancelled": (data: any) => void;
  "member_subscription:expired": (data: any) => void;
  "invoice:created": (data: {
    invoice: any;
    subscription: any;
    plan: any;
    timestamp: string;
  }) => void;
  "invoice:paid": (data: any) => void;
  "invoice:overdue": (data: any) => void;
  connected: (data: { message: string; organizationId: string }) => void;
  error: (data: { message: string }) => void;
}
// export const BASE_URL = "https://api.reetrack.com";
const BASE_URL = "http://localhost:4000";
// const BASE_URL = "https://reetrack-production-f1dc.up.railway.app";
// const BASE_URL = "https://reetrack-production.up.railway.app";
// const BASE_URL = "https://paypips.onrender.com";

class ReeTrackWebSocket {
  private socket: Socket<SubscriptionEvents> | null = null;

  // constructor(private token: string) {}
  constructor() {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(`${BASE_URL}/subscriptions`, {
        // auth: {
        //   token: this.token,
        // },
        withCredentials: true,
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to ReeTrack WebSocket");
        resolve();
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from WebSocket:", reason);
        if (reason === "io server disconnect") {
          // Server disconnected, reconnect manually
          this.socket?.connect();
        }
      });

      this.socket.on("connect_error", async (error) => {
        console.error("WebSocket connection error:", error);
        if (error.message.includes("Unauthorized")) {
          await apiClient.post("/auth/refresh"); // sets new cookie
          this.socket?.connect(); // reconnect with new cookie
        }
        reject(error);
      });

      // Set up event listeners
      this.setupEventListeners();
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Plan events
    this.socket.on("plan:upgraded", (data) => {
      console.log("Plan upgraded:", data);
      // Show notification to user
      this.showNotification("success", `Plan upgraded to ${data.newPlan}`);
      // Update UI state
      this.updatePlanInUI(data.newPlan);
    });

    this.socket.on("plan:downgraded", (data) => {
      console.log("Plan downgraded:", data);
      this.showNotification("warning", `Plan downgraded to ${data.newPlan}`);
      this.updatePlanInUI(data.newPlan);
    });

    this.socket.on("plan:expired", (data) => {
      console.log("Plan expired:", data);
      this.showNotification("error", "Your plan has expired");
      this.updatePlanInUI(data.fallbackPlan);
    });

    // Subscription events
    this.socket.on("subscription:status_changed", (data) => {
      console.log("Subscription status changed:", data);
      this.showNotification("info", `Subscription status: ${data.status}`);
      this.updateSubscriptionInUI(data.subscriptionId, data.status);
    });

    // Payment events
    this.socket.on("payment:success", (data) => {
      console.log("Payment successful:", data);
      this.showNotification(
        "success",
        `Payment of ${data.currency}${data.amount} is successful from ${data.memberName}`,
      );
      this.refreshPaymentHistory();
    });

    this.socket.on("payment:failed", (data) => {
      console.log("Payment failed:", data);
      this.showNotification("error", `Payment failed: ${data.reason}`);
      this.refreshPaymentHistory();
    });

    this.socket.on("payment:reminder", (data) => {
      console.log("Payment reminder:", data);
      this.showNotification(
        "warning",
        `Payment of ${data.currency}${data.amount} due on ${data.dueDate} by ${data.memberName}`,
      );
    });

    // Member joined
    this.socket.on("member:joined", (data) => {
      console.log("Member joined organization:", data);
      this.showNotification("success", `New member joined, ${data.memberName}`);
    });

    // Member subscription events
    this.socket.on("member_subscription:created", (data) => {
      console.log("Member subscription created:", data);
      this.showNotification(
        "success",
        `New subscription created for ${data.member.firstName}`,
      );
      this.refreshMemberSubscriptions();
    });

    // Invoice events
    this.socket.on("invoice:created", (data) => {
      console.log("Invoice created:", data);
      this.showNotification(
        "info",
        `New invoice ${data.invoice.invoice_number} created`,
      );
      this.refreshInvoices();
    });

    this.socket.on("invoice:paid", (data) => {
      console.log("Invoice paid:", data);
      this.showNotification("success", "Invoice paid successfully");
      this.refreshInvoices();
    });

    // Connection events
    this.socket.on("connected", (data) => {
      console.log("Successfully connected:", data);
    });

    this.socket.on("error", (data) => {
      console.error("WebSocket error:", data);
      this.showNotification("error", data.message);
    });
  }

  // Helper methods for UI updates
  private showNotification(
    type: "success" | "error" | "warning" | "info",
    message: string,
  ) {
    // Use sonner toast for notifications
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
    }
  }

  private updatePlanInUI(newPlan: string) {
    // Update the plan display in your UI
    // This could trigger a state update in React, Vue, etc.
    console.log("Updating plan in UI to:", newPlan);
    // Trigger cache invalidation for plans
    this.invalidateCache(["plans"]);
  }

  private updateSubscriptionInUI(subscriptionId: string, status: string) {
    // Update subscription status in UI
    console.log(`Updating subscription ${subscriptionId} to status: ${status}`);
    // Trigger cache invalidation for subscriptions
    this.invalidateCache(["subscriptions"]);
  }

  private refreshPaymentHistory() {
    // Refresh payment history in UI
    console.log("Refreshing payment history");
    // Trigger cache invalidation for payments
    this.invalidateCache(["payments"]);
  }

  private refreshMemberSubscriptions() {
    // Refresh member subscriptions in UI
    console.log("Refreshing member subscriptions");
    // Trigger cache invalidation for member subscriptions
    this.invalidateCache(["member", "subscriptions"]);
  }

  private refreshInvoices() {
    // Refresh invoices in UI
    console.log("Refreshing invoices");
    // Trigger cache invalidation for invoices
    this.invalidateCache(["invoices"]);
  }

  private invalidateCache(queryKey: string[]) {
    // Dispatch custom event for cache invalidation
    window.dispatchEvent(
      new CustomEvent("websocket:invalidate-cache", {
        detail: { queryKey },
      }),
    );
  }

  // Public methods
  subscribeToSubscription(subscriptionId: string) {
    if (!this.socket?.connected) {
      console.warn(
        "WebSocket not connected. Cannot subscribe to subscription:",
        subscriptionId,
      );
      return;
    }

    console.log("Subscribing to subscription:", subscriptionId);
    // this.socket.emit("subscribe:subscription", { subscriptionId });
  }

  unsubscribeFromSubscription(subscriptionId: string) {
    if (!this.socket?.connected) {
      console.warn(
        "WebSocket not connected. Cannot unsubscribe from subscription:",
        subscriptionId,
      );
      return;
    }

    console.log("Unsubscribing from subscription:", subscriptionId);
    // this.socket.emit("unsubscribe:subscription", { subscriptionId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export { ReeTrackWebSocket };

// React hook for WebSocket
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<ReeTrackWebSocket | null>(null);

  useEffect(() => {
    const ws = new ReeTrackWebSocket();
    wsRef.current = ws;

    // Try to connect, but don't fail if server doesn't support WebSocket yet
    ws.connect()
      .then(() => {
        setIsConnected(true);
        console.log("WebSocket connected successfully");
      })
      .catch((error) => {
        console.warn(
          "WebSocket not available (server may not support it yet):",
          error,
        );
        setIsConnected(false);
      });

    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, []);

  // const subscribeToSubscription = (subscriptionId: string) => {
  //   wsRef.current?.subscribeToSubscription(subscriptionId);
  // };

  // const unsubscribeFromSubscription = (subscriptionId: string) => {
  //   wsRef.current?.unsubscribeFromSubscription(subscriptionId);
  // };

  // Method to manually trigger cache invalidation from WebSocket events
  // const invalidateCache = (queryKey: string[]) => {
  //   // This will be used by components to invalidate their queries
  //   window.dispatchEvent(
  //     new CustomEvent("websocket:invalidate-cache", {
  //       detail: { queryKey },
  //     }),
  //   );
  // };

  return {
    isConnected,
    // subscribeToSubscription,
    // unsubscribeFromSubscription,
    // invalidateCache,
  };
}
