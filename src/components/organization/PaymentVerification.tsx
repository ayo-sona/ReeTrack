// src/components/organization/PaymentVerification.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

export function PaymentVerification() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const verifyPayment = async (ref: string) => {
    try {
      const { data } = await apiClient.get(`/payments/paystack/verify/${ref}`);

      if (data.data.status === "success") {
        // Show success message
        alert("Payment successful! Your subscription is now active.");
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  return null; // This component doesn't render anything
}