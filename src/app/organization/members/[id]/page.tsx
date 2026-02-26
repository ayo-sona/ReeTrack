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
      return {
        className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        dot: "bg-emerald-500",
      };
    case "expired":
      return {
        className: "bg-red-50 text-red-600 border border-red-100",
        dot: "bg-red-500",
      };
    case "canceled":
    case "cancelled":
      return { className: "bg-gray-100 text-[#9CA3AF]", dot: "bg-gray-400" };
    case "pending":
      return {
        className: "bg-amber-50 text-amber-700 border border-amber-100",
        dot: "bg-amber-400",
      };
    default:
      return { className: "bg-gray-100 text-[#9CA3AF]", dot: "bg-gray-400" };
  }
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;
  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<
    Member["subscriptions"][number] | null
  >(null);

  const { data: member, isLoading, error } = useMemberById(memberId);
  const updateSubscription = useUpdateSubscription();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 font-[Nunito,sans-serif]">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin mb-3" />
        <p className="text-sm text-[#9CA3AF]">Loading member details...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const is404 =
      errorMessage.includes("404") || errorMessage.includes("Not Found");

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 px-4 text-center font-[Nunito,sans-serif]">
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
            <p className="text-sm font-semibold text-amber-700 mb-2">
              Possible reasons:
            </p>
            <ul className="text-xs text-amber-600 space-y-1">
              <li>• The member ID in the URL is incorrect</li>
              <li>• The member was deleted from your organisation</li>
              <li>• You don&apos;t have permission to view this member</li>
            </ul>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => router.push("/organization/members")}
            className="w-full sm:w-auto"
          >
            View All Members
          </Button>
        </div>
      </div>
    );
  }

  // ── No data ──────────────────────────────────────────────────────────────
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 px-4 text-center font-[Nunito,sans-serif]">
        <div className="w-16 h-16 bg-[#F9FAFB] border border-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-[#9CA3AF]" />
        </div>
        <h2 className="text-lg font-bold text-[#1F2937] mb-1">
          Member Not Found
        </h2>
        <p className="text-sm text-[#9CA3AF] mb-5">No member data available</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => router.push("/organization/members")}
        >
          View All Members
        </Button>
      </div>
    );
  }

  // ── Derived data ─────────────────────────────────────────────────────────
  const user = member.user;
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "M";
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
    } catch {
      toast.error("Failed to grant access. Please try again.");
    }
  };

  return (
    <>
      <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* ── Page header ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 text-[#9CA3AF] hover:bg-white hover:text-[#1F2937] transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#1F2937] truncate">
                Member Details
              </h1>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
                View and manage member information
              </p>
            </div>
          </div>

          {/* ── Main grid ──────────────────────────────────────────────────── */}
          {/* Mobile: single column stack. lg: sidebar + main */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ── Profile card ─────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                {/* Avatar + name */}
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-3">
                    <span className="text-lg sm:text-xl font-extrabold text-[#0D9488]">
                      {initials}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1F2937] break-words">
                    {fullName}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                        statusCfg.className,
                      )}
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full flex-shrink-0",
                          statusCfg.dot,
                        )}
                      />
                      {status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488]">
                      Member
                    </span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                  <div className="flex items-start gap-3 min-w-0">
                    <Mail className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#1F2937] break-all min-w-0">
                      {email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                    <span className="text-sm text-[#1F2937]">{phone}</span>
                  </div>
                  {createdAt && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                      <span className="text-sm text-[#9CA3AF]">
                        Joined {formatDate(createdAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                      Check-ins
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-[#F06543] flex-shrink-0" />
                      <p className="text-lg font-extrabold text-[#1F2937]">
                        {member.check_in_count || 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                      Email
                    </p>
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />{" "}
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />{" "}
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal information */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-bold text-[#1F2937] mb-4">
                  Personal Information
                </h3>
                {/* 1 col on mobile → 3 on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Member Since",
                      value: createdAt ? formatDate(createdAt) : "N/A",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3"
                    >
                      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-[#1F2937]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscriptions */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-bold text-[#1F2937] mb-4">
                  Subscriptions
                </h3>

                {member.subscriptions && member.subscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {member.subscriptions.map((subscription) => {
                      const subStatus = getStatusConfig(subscription.status);
                      const canGrantAccess =
                        subscription.status === "expired" ||
                        subscription.status === "pending";

                      return (
                        <div
                          key={subscription.id}
                          className="border border-gray-100 rounded-xl p-4 bg-[#F9FAFB]"
                        >
                          {/* On mobile: stack plan info and button. On sm+: row */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              {/* Plan name + status badge */}
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-sm font-bold text-[#1F2937]">
                                  {subscription.plan.name}
                                </p>
                                <span
                                  className={clsx(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize",
                                    subStatus.className,
                                  )}
                                >
                                  {subscription.status.charAt(0).toUpperCase() +
                                    subscription.status.slice(1)}
                                </span>
                              </div>

                              {subscription.plan.description && (
                                <p className="text-xs text-[#9CA3AF] mb-2 leading-relaxed">
                                  {subscription.plan.description}
                                </p>
                              )}

                              {/* Date range — wraps gracefully on small screens */}
                              <p className="text-xs text-[#9CA3AF] break-words">
                                {formatDate(new Date(subscription.started_at))}{" "}
                                →{" "}
                                {formatDate(new Date(subscription.expires_at))}
                              </p>

                              {subscription.auto_renew && (
                                <p className="text-xs font-semibold text-[#0D9488] mt-1">
                                  ↻ Auto-renew enabled
                                </p>
                              )}

                              {Array.isArray(subscription.plan.features) &&
                                subscription.plan.features.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {subscription.plan.features.map(
                                      (feature: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488]"
                                        >
                                          {feature}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>

                            {canGrantAccess && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="w-full sm:w-auto flex-shrink-0"
                                onClick={() => {
                                  setCurrentSubscription(subscription);
                                  setShowGrantAccessModal(true);
                                }}
                              >
                                <UserPlus className="h-3.5 w-3.5" />
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
                    <p className="text-sm font-bold text-[#1F2937] mb-0.5">
                      No subscriptions
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      This member has no active or past subscriptions
                    </p>
                  </div>
                )}
              </div>

              {/* Additional metadata */}
              {member.metadata && Object.keys(member.metadata).length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <h3 className="text-sm sm:text-base font-bold text-[#1F2937] mb-4">
                    Additional Information
                  </h3>
                  <div className="divide-y divide-gray-50">
                    {Object.entries(member.metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-1 sm:gap-4 text-sm"
                      >
                        <span className="text-[#9CA3AF] font-semibold capitalize flex-shrink-0">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-[#1F2937] font-semibold break-all sm:text-right">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
