"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Building, CheckCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { deleteCookie } from "cookies-next";

export default function CompleteOrgSetupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeOrgSetup = async () => {
      // Get stored org data
      const pendingOrgData = localStorage.getItem("pending_org_data");

      if (!pendingOrgData) {
        setError("No pending organization setup found");
        setStatus("error");
        return;
      }

      const orgData = JSON.parse(pendingOrgData);

      try {
        // Step 1: Login with credentials
        await apiClient.post("/auth/login", {
          email: orgData.email,
          password: orgData.password,
        });

        // Step 2: Create organization
        const response = await apiClient.post("/auth/register-organization", {
          organizationName: orgData.organizationName,
          organizationEmail: orgData.organizationEmail,
          email: orgData.email,
        });

        if (response.data.statusCode === 201) {
          localStorage.setItem(
            "newOrganizationId",
            response.data.data.organization.id,
          );

          // Clean up
          localStorage.removeItem("pending_org_data");

          // Delete cookies
          // deleteCookie("access_token");
          deleteCookie("user_roles");
          deleteCookie("current_role");

          // Set onboarding flag
          localStorage.setItem("onboarding_pending", "true");

          setStatus("success");
          toast.success("Organization created successfully!");

          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      } catch (err: any) {
        console.error("Organization creation error:", err);
        const message =
          err?.response?.data?.message ||
          "Failed to create organization. Please try again.";
        setError(message);
        setStatus("error");
        toast.error(message);
      }
    };

    completeOrgSetup();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F06543]/10 to-[#0D9488]/10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[#0D9488] animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-[#1F2937] mb-2">
              Setting up your organization...
            </h1>
            <p className="text-sm text-[#9CA3AF]">
              Please wait while we complete your setup
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-[#1F2937] mb-2">
              Organization Created!
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-4">
              Redirecting you to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-[#1F2937] mb-2">
              Setup Failed
            </h1>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/auth/org/register")}
              className="px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-semibold hover:bg-[#0B7A70] transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
