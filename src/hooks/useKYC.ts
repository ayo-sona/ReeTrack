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
      const raw = localStorage.getItem("userData");
      if (!raw) {
        setIsVerified(false);
        return;
      }
      const userData = JSON.parse(raw);

      // Support both single org and multi-org setups
      const selectedOrgId = localStorage.getItem("selectedOrganizationId");
      const org = selectedOrgId
        ? userData?.organizations?.find((o: any) => o.id === selectedOrgId)
        : userData?.organizations?.[0];

      const verified = org?.metadata?.bvnVerified === true;
      setIsVerified(verified);
    } catch {
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markVerified = () => {
    setIsVerified(true);

    // Also patch localStorage so other components reading it stay in sync
    try {
      const raw = localStorage.getItem("userData");
      if (!raw) return;
      const userData = JSON.parse(raw);

      const selectedOrgId = localStorage.getItem("selectedOrganizationId");
      const orgs = userData?.organizations ?? [];
      const targetId = selectedOrgId ?? orgs[0]?.id;

      const updated = {
        ...userData,
        organizations: orgs.map((org: any) =>
          org.id === targetId
            ? {
                ...org,
                metadata: {
                  ...(org.metadata ?? {}),
                  bvnVerified: true,
                },
              }
            : org
        ),
      };

      localStorage.setItem("userData", JSON.stringify(updated));
    } catch {
      // silently ignore — in-memory state is already updated
    }
  };

  return { isVerified, isLoading, markVerified };
}