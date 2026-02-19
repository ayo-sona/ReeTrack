"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Heart,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useMemberById } from "@/hooks/useMembers";
import { useUpdateSubscription } from "@/hooks/useSubscriptions";
import { GrantAccessModal } from "@/components/organization/GrantAccessModal";
import type { Member } from "@/types/organization";
import clsx from "clsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface GrantAccessData {
  memberId: string;
  planId: string;
  subscriptionId: string;
  intervalCount?: number;
  interval?: "days" | "months";
  metadata?: {
    grantedReason?: string;
    grantedAt?: string;
  };
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "active":
      return { className: "bg-emerald-50 text-emerald-700 border border-emerald-100", dot: "bg-emerald-500" };
    case "expired":
      return { className: "bg-red-50 text-red-600 border border-red-100", dot: "bg-red-500" };
    case "canceled":
    case "cancelled":
      return { className: "bg-gray-100 text-[#9CA3AF]", dot: "bg-gray-400" };
    case "pending":
      return { className: "bg-amber-50 text-amber-700 border border-amber-100", dot: "bg-amber-400" };
    default:
      return { className: "bg-gray-100 text-[#9CA3AF]", dot: "bg-gray-400" };
  }
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;
  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Member["subscriptions"][number] | null>(null);

  const { data: member, isLoading, error } = useMemberById(memberId);
  const updateSubscription = useUpdateSubscription();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin mb-3" />
        <p className="text-sm text-[#9CA3AF]">Loading member details...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const is404 = errorMessage.includes("404") || errorMessage.includes("Not Found");

    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-[#1F2937] mb-1">
          {is404 ? "Member Not Found" : "Error Loading Member"}
        </h2>
        <p className="text-sm text-red-500 mb-1">{errorMessage}</p>
        <p className="text-xs text-[#9CA3AF] mb-5">
          Member ID:{" "}
          <code className="bg-[#F9FAFB] border border-gray-100 px-2 py-0.5 rounded font-mono">
            {memberId}
          </code>
        </p>

        {is404 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 max-w-sm text-left mb-5">
            <p className="text-sm font-semibold text-amber-700 mb-2">Possible reasons:</p>
            <ul className="text-xs text-amber-600 space-y-1">
              <li>• The member ID in the URL is incorrect</li>
              <li>• The member was deleted from your organisation</li>
              <li>• You don't have permission to view this member</li>
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => router.push("/organization/members")}>
            View All Members
          </Button>
        </div>
      </div>
    );
  }

  // ── No data ──────────────────────────────────────────────────────────────
  if (!member) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="w-16 h-16 bg-[#F9FAFB] border border-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-[#9CA3AF]" />
        </div>
        <h2 className="text-lg font-bold text-[#1F2937] mb-1">Member Not Found</h2>
        <p className="text-sm text-[#9CA3AF] mb-5">No member data available</p>
        <Button type="button" variant="secondary" size="sm" onClick={() => router.push("/organization/members")}>
          View All Members
        </Button>
      </div>
    );
  }

  // ── Data ─────────────────────────────────────────────────────────────────
  const user = member.user;
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "M";
  const email = user?.email || "N/A";
  const phone = user?.phone || "N/A";
  const createdAt = member.created_at ? new Date(member.created_at) : null;
  const status = user?.status || "inactive";
  const emailVerified = user?.email_verified || false;
  const lastLoginAt = user?.last_login_at ? new Date(user.last_login_at) : null;
  const statusCfg = getStatusConfig(status);

  const handleGrantAccess = async (data: GrantAccessData) => {
    try {
      await updateSubscription.mutateAsync({
        subscriptionId: data.subscriptionId,
        status: "active",
        metadata: data.metadata,
      });
      toast.success("Access granted successfully!");
      setShowGrantAccessModal(false);
    } catch (error) {
      toast.error("Failed to grant access. Please try again.");
      console.error("Grant access error:", error);
    }
  };

  return (
    <>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1F2937]">Member Details</h1>
            <p className="text-sm text-[#9CA3AF] mt-0.5">View and manage member information</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Profile card ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {/* Avatar + name */}
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-[#0D9488]">{initials}</span>
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">{fullName}</h2>
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize", statusCfg.className)}>
                    <span className={clsx("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                    {status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488]">
                    Member
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#1F2937] break-all">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                  <span className="text-sm text-[#1F2937]">{phone}</span>
                </div>
                {createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                    <span className="text-sm text-[#9CA3AF]">Joined {formatDate(createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Check-ins</p>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-[#F06543]" />
                    <p className="text-lg font-extrabold text-[#1F2937]">{member.check_in_count || 0}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Email</p>
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Clock className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-[#1F2937] mb-4">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Member Since", value: createdAt ? formatDate(createdAt) : "N/A" },
                  { label: "Account Created", value: user?.created_at ? formatDate(new Date(user.created_at)) : "N/A" },
                  { label: "Last Login", value: lastLoginAt ? formatDate(lastLoginAt) : "Never" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3">
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-sm font-semibold text-[#1F2937]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriptions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-[#1F2937] mb-4">Subscriptions</h3>

              {member.subscriptions && member.subscriptions.length > 0 ? (
                <div className="space-y-3">
                  {member.subscriptions.map((subscription) => {
                    const subStatus = getStatusConfig(subscription.status);
                    const canGrantAccess =
                      subscription.status === "expired" || subscription.status === "canceled";

                    return (
                      <div
                        key={subscription.id}
                        className="border border-gray-100 rounded-xl p-4 bg-[#F9FAFB]"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="text-sm font-bold text-[#1F2937]">{subscription.plan.name}</p>
                              <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize", subStatus.className)}>
                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                              </span>
                            </div>

                            {subscription.plan.description && (
                              <p className="text-xs text-[#9CA3AF] mb-2">{subscription.plan.description}</p>
                            )}

                            <p className="text-xs text-[#9CA3AF]">
                              {formatDate(new Date(subscription.started_at))} →{" "}
                              {formatDate(new Date(subscription.expires_at))}
                            </p>

                            {subscription.auto_renew && (
                              <p className="text-xs font-semibold text-[#0D9488] mt-1">↻ Auto-renew enabled</p>
                            )}

                            {Array.isArray(subscription.plan.features) && subscription.plan.features.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {subscription.plan.features.map((feature: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488]"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {canGrantAccess && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setCurrentSubscription(subscription);
                                setShowGrantAccessModal(true);
                              }}
                            >
                              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                              Grant Access
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-[#0D9488]" />
                  </div>
                  <p className="text-sm font-bold text-[#1F2937] mb-0.5">No subscriptions</p>
                  <p className="text-xs text-[#9CA3AF]">This member has no active or past subscriptions</p>
                </div>
              )}
            </div>

            {/* Additional metadata */}
            {member.metadata && Object.keys(member.metadata).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-[#1F2937] mb-4">Additional Information</h3>
                <div className="divide-y divide-gray-50">
                  {Object.entries(member.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-[#9CA3AF] font-semibold capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-[#1F2937] font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showGrantAccessModal && (
        <GrantAccessModal
          member={member}
          onClose={() => setShowGrantAccessModal(false)}
          onGrant={handleGrantAccess}
          currentSubscription={currentSubscription}
        />
      )}
    </>
  );
}