// src/components/organization/PaymentVerification.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export function PaymentVerification() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const verifyPayment = async (ref: string) => {
    try {
      const { data } = await apiClient.get(`/payments/paystack/verify/${ref}`);
      if (data.data.status === "success") {
        toast.success("Payment successful! Your subscription is now active.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  return null;
}