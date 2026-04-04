"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowRight, Loader2, Search, LogOut } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { setCookie, deleteCookie } from "cookies-next";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

interface OrganizationWithRole {
  id: string;
  name: string;
  email: string;
  role: string;
  slug?: string;
  subscription_plan?: string;
  created_at: string;
  memberCount: number;
}

const roleStyles: Record<string, string> = {
  owner: "bg-amber-50 text-amber-700 border border-amber-200",
  admin: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20",
  staff: "bg-gray-100 text-gray-600 border border-gray-200",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function OrganizationSelectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) setUserData(JSON.parse(stored));
    } catch {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectOrganization = async (orgId: string, role: string) => {
    setSelectedOrg(orgId);
    try {
      localStorage.setItem("selectedOrganizationId", orgId);
      const response = await apiClient.get(`/organizations/select/${orgId}`);

      if (response.data.statusCode === 200) {
        // setCookie("access_token", response.data.data.accessToken);
        setCookie("current_role", role, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            // secure: true,
            secure: false,
            path: "/",
          },);
        // localStorage.setItem("verifiedOrg", response.data.data.verified);

        await queryClient.invalidateQueries({ queryKey: ["organizations"] });
        await queryClient.invalidateQueries({ queryKey: ["analytics"] });
        await queryClient.invalidateQueries({ queryKey: ["plans"] });
        await queryClient.invalidateQueries({ queryKey: ["payments"] });
        await queryClient.invalidateQueries({ queryKey: ["members"] });

        // Check if onboarding is pending — redirect there instead of dashboard
        const onboardingPending = localStorage.getItem("onboarding_pending");
        const newOrganizationId = localStorage.getItem("newOrganizationId");
        if (onboardingPending && newOrganizationId === orgId) {
          localStorage.removeItem("onboarding_pending");
          localStorage.removeItem("newOrganizationId");
          router.push("/organization/onboarding/bank-account");
          return;
        }

        router.push("/organization/dashboard");
        toast.success("Organization selected");
      }
    } catch {
      toast.error("Failed to select organization");
      setSelectedOrg(null);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      if (typeof window !== "undefined") localStorage.clear();
      // deleteCookie("access_token");
      deleteCookie("current_role");
      deleteCookie("user_roles");
      setLoading(false);
      router.push("/auth/login");
      router.refresh();
    }
  };

  const orgs: OrganizationWithRole[] =
    userData?.organizations?.filter(
      (o: OrganizationWithRole) =>
        o.role !== "MEMBER" &&
        o.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Diagonal Split Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F06543] to-[#D85436]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0B7A70]"
          style={{ clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[40%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/relaxing_hammock.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[35%] right-[25%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/eating_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[3%] right-[35%] w-20 h-20 sm:w-24 sm:h-24 opacity-85">
          <Image
            src="/undraw/hot_air_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[30%] right-[20%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/skateboarding.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[44%] left-[27%] w-24 h-24 opacity-90">
          <Image
            src="/undraw/fitness.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[25%] left-[22%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image
            src="/undraw/floating_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[10%] left-[25%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image
            src="/undraw/playing_with_dog.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[10%] right-[24%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/bike_driving.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Link href="/">
                  <Logo size={32} />
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-[#1F2937] mt-1 mb-2">
                Your Workspaces
              </h1>
              <p className="text-[#1F2937]/60">
                Select an organization to continue
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find an organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-[#F9FAFB] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-colors"
              />
            </div>

            {/* List */}
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden max-h-64 overflow-y-auto mb-5">
              {loading &&
                [1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-3.5 animate-pulse"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  </li>
                ))}

              {!loading && orgs.length === 0 && (
                <li className="px-4 py-8 text-center">
                  <p className="text-sm text-[#1F2937]/40">
                    {searchQuery
                      ? "No organizations match your search"
                      : "You have no organizations yet"}
                  </p>
                </li>
              )}

              {!loading &&
                orgs.map((org) => {
                  const isSelecting = selectedOrg === org.id;
                  const roleKey = org.role.toLowerCase();
                  const roleClass =
                    roleStyles[roleKey] ??
                    "bg-gray-100 text-gray-600 border border-gray-200";

                  return (
                    <li key={org.id}>
                      <button
                        onClick={() =>
                          handleSelectOrganization(org.id, org.role)
                        }
                        disabled={!!selectedOrg}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFB] transition-colors disabled:opacity-60 disabled:cursor-not-allowed group text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-extrabold text-[#0D9488]">
                            {getInitials(org.name)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1F2937] truncate">
                            {org.name}
                          </p>
                          <span
                            className={`inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${roleClass}`}
                          >
                            {org.role}
                          </span>
                        </div>

                        {isSelecting ? (
                          <Loader2 className="w-4 h-4 text-[#0D9488] animate-spin shrink-0" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0D9488] transition-colors shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
            </ul>

            {/* Create New */}
            <button
              onClick={() => router.push("/auth/org/register")}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-2.5 text-sm font-semibold text-gray-400 hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#0D9488]/5 transition-colors mb-3"
            >
              <Plus className="w-4 h-4" />
              Create new organization
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-[#1F2937]/60">
                  Not your account?
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
