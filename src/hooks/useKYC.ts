"use client";

import { useState, useEffect } from "react";

interface KycStatus {
  isVerified: boolean;
  isLoading: boolean;
  /** Call this after a successful BVN verification to update state in memory */
  markVerified: () => void;
}

export function useKycStatus(): KycStatus {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const verified = localStorage.getItem("bvnVerified") === "true";
      setIsVerified(verified);
    } catch {
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markVerified = () => {
    setIsVerified(true);
    localStorage.setItem("bvnVerified", "true");
  };

  return { isVerified, isLoading, markVerified };
}