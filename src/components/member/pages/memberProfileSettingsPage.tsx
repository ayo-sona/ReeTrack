"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Trash2,
  Save,
  AlertCircle,
  MapPin,
  CheckCircle,
} from "lucide-react";
import {
  useProfile,
  useUpdateProfile,
  useDeleteMember,
} from "@/hooks/memberHook/useMember";
import { deleteCookie } from "cookies-next";

// Interface for the wrapped API response
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Type for the actual user profile data
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  email_verified: boolean;
  date_of_birth: string | null;
  address: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const deleteMember = useDeleteMember();

  // Debug logging
  console.log("Profile Debug:", {
    profile,
    isLoading,
    error,
    hasProfile: !!profile,
    hasData: !!(profile as unknown as ApiResponse<UserProfile>)?.data,
    profileStructure: profile ? Object.keys(profile) : [],
  });

  // ✅ Handle wrapped API response - the actual user data is in profile.data
  // The API returns { statusCode: 200, message: "Success", data: {...actual user data} }
  const wrappedProfile = profile as unknown as
    | ApiResponse<UserProfile>
    | undefined;
  const actualProfile =
    wrappedProfile?.data || (profile as unknown as UserProfile);

  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDateOfBirth, setEditedDateOfBirth] = useState<string | null>(
    null,
  );
  const [editedAddress, setEditedAddress] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ✅ Compute values using actualProfile
  const dateOfBirth = editedDateOfBirth ?? (actualProfile?.date_of_birth || "");
  const address = editedAddress ?? (actualProfile?.address || "");

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        date_of_birth: dateOfBirth || undefined,
        address: address || undefined,
      });
      setIsEditing(false);
      setEditedDateOfBirth(null);
      setEditedAddress(null);
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edited values
    setEditedDateOfBirth(null);
    setEditedAddress(null);
  };

  const handleLogout = () => {
    // Clear cookies and local storage
    deleteCookie("access_token");
    deleteCookie("current_role");
    deleteCookie("user_roles");
    localStorage.clear();

    // Redirect to login
    router.push("/auth/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMember.mutateAsync();

      // Clear session
      deleteCookie("access_token");
      deleteCookie("current_role");
      deleteCookie("user_roles");
      localStorage.clear();

      // Redirect to login
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <p className="text-center text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !actualProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Unable to load profile
          </h3>
          <p className="text-gray-600 mb-2">Please try refreshing the page</p>
          <pre className="text-left bg-gray-100 p-4 rounded mt-4 text-xs overflow-auto">
            {JSON.stringify({ profile, actualProfile }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "account"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Account</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={updateProfile.isPending}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {actualProfile.first_name?.charAt(0) || ""}
                    {actualProfile.last_name?.charAt(0) || ""}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {actualProfile.first_name} {actualProfile.last_name}
                    </h3>
                    <p className="text-gray-600">{actualProfile.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Member since{" "}
                      {new Date(actualProfile.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>

                {/* Read-only Fields */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={actualProfile.first_name || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={actualProfile.last_name || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={actualProfile.email || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={actualProfile.phone || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Contact support to update these fields
                  </p>
                </div>

                {/* Editable Fields */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Date of Birth
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Required for age-restricted subscriptions
                      </p>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setEditedDateOfBirth(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Address
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Your residential address
                      </p>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setEditedAddress(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Email Verification Status */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {actualProfile.email_verified ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Email verified
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">
                            Email not verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Account Stats */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Account Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-gray-600">Account Status</p>
                      <p className="text-lg font-bold text-emerald-600 capitalize">
                        {actualProfile.status || "Active"}
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="text-lg font-bold text-blue-600">
                        {actualProfile.last_login_at
                          ? new Date(
                              actualProfile.last_login_at,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Sign Out
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sign out of your account on this device. You can sign back
                    in anytime.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full md:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>

                {/* Delete Account */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
                  <h3 className="text-lg font-bold text-red-900 mb-4">
                    Danger Zone
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Once you delete your account, there is no going back. All
                    your data, subscriptions, and payment history will be
                    permanently deleted.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Delete Account?
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              This action cannot be undone. All your data, subscriptions, and
              payment history will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMember.isPending}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteMember.isPending}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMember.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
