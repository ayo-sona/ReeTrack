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
} from "lucide-react";
import { useMemberById } from "@/hooks/useMembers";
import { useUpdateSubscription } from "@/hooks/useSubscriptions";
import { GrantAccessModal } from "@/components/organization/GrantAccessModal";
import type { Member } from "@/types/organization";
import clsx from "clsx";
import { toast } from "sonner";
import { Spinner } from "@heroui/react";

// Define the type for grant access data
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

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;
  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Member['subscriptions'][number] | null>(null);

  // Fetch member using hook
  const { data: member, isLoading, error } = useMemberById(memberId);

  // Debug: Log the response
  // console.log("Member data:", member);
  // console.log("Error:", error);

  // Update access mutation
  const updateSubscription = useUpdateSubscription();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-center py-12">
        <Spinner color="secondary" />
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const is404 =
      errorMessage.includes("404") || errorMessage.includes("Not Found");

    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {is404 ? "Member Not Found" : "Error Loading Member"}
        </h2>
        <p className="text-red-500 dark:text-red-400 mb-2">{errorMessage}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Member ID:{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {memberId}
          </code>
        </p>
        {is404 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto mb-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This member may have been deleted or the ID is incorrect. Please
              check:
            </p>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 text-left">
              <li>• The member ID in the URL is correct</li>
              <li>• The member exists in your organization</li>
              <li>• You have permission to view this member</li>
            </ul>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push("/organization/members")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Members
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Member Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No member data available
        </p>
        <button
          onClick={() => router.push("/organization/members")}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Members
        </button>
      </div>
    );
  }

  // Extract user data from the API response
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

  const role = "MEMBER";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Member Details
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View and manage member information
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Member Profile */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-medium text-white">
                    {initials}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {fullName}
                </h2>
                <span
                  className={clsx(
                    "mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize",
                    getStatusColor(status),
                  )}
                >
                  {status}
                </span>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {role}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Mail className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-900 dark:text-gray-100 break-words">
                    {email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {phone}
                  </span>
                </div>
                {createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Joined {formatDate(createdAt)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Check-ins
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {member.check_in_count || 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {emailVerified ? (
                        <span className="text-green-600 dark:text-green-400">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Unverified
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Personal Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {createdAt ? formatDate(createdAt) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User Created
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.created_at
                      ? formatDate(new Date(user.created_at))
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Login
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {lastLoginAt ? formatDate(lastLoginAt) : "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscriptions */}
            {member.subscriptions && member.subscriptions.length > 0 ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Subscriptions
                </h3>
                <div className="space-y-4">
                  {member.subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {subscription.plan.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {subscription.plan.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(new Date(subscription.started_at))} -{" "}
                            {formatDate(new Date(subscription.expires_at))}
                          </p>
                          {subscription.auto_renew && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              Auto-renew enabled
                            </span>
                          )}
                        </div>
                        {Array.isArray(subscription.plan.features) &&
                          subscription.plan.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {subscription.plan.features.map(
                                (feature: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  >
                                    {feature}
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                      <div className="ml-4">
                        <span
                          className={clsx(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                            subscription.status === "active" &&
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            subscription.status === "expired" &&
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                            subscription.status === "canceled" &&
                              "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                          )}
                        >
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </span>
                      </div>
                      {/* Grant Access Button */}
                      {subscription.status === "expired" ||
                      subscription.status === "canceled" ? (
                        <button
                          onClick={() => {
                            setCurrentSubscription(subscription);
                            setShowGrantAccessModal(true);
                          }}
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                          <UserPlus className="h-4 w-4" />
                          Grant Access
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Subscriptions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No active subscriptions
                </p>
              </div>
            )}

            {/* Metadata */}
            {member.metadata && Object.keys(member.metadata).length > 0 && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  {Object.entries(member.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
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

      {/* Grant Access Modal */}
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
