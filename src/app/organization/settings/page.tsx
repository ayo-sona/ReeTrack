"use client";

import { useEffect, useState } from "react";
import { Building2, User, Save, Loader2 } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function SettingsPage() {
  const [orgData, setOrgData] = useState({
    name: "",
    email: "",
    address: "",
    website: "",
    role: "",
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await apiClient.get("/auth/profile");
        setProfileData({
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
          email: response.data.data.email,
          phone: response.data.data.phone,
        });
        setOrgData({
          name: response.data.data.organizations[0].name,
          email: response.data.data.organizations[0].email,
          address: response.data.data.organizations[0].address,
          website: response.data.data.organizations[0].website,
          role: response.data.data.organizations[0].role,
        });
        console.log("Profile fetched:", response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleOrgSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Organization updated:", orgData);
    // TODO: Implement API call
  };

  const handleProfileSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
    // TODO: Implement API call
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your organization and profile settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organization Settings */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Organization Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your business information
              </p>
            </div>
          </div>

          <form onSubmit={handleOrgSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="org-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Organization Name
              </label>
              <input
                id="org-name"
                type="text"
                value={orgData.name}
                onChange={(e) =>
                  setOrgData({ ...orgData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="org-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="org-email"
                type="email"
                value={orgData.email}
                onChange={(e) =>
                  setOrgData({ ...orgData, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="org-role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Role
              </label>
              <input
                id="org-role"
                type="text"
                value={orgData.role}
                disabled
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="org-address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Address
              </label>
              <textarea
                id="org-address"
                value={orgData.address}
                onChange={(e) =>
                  setOrgData({ ...orgData, address: e.target.value })
                }
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="org-website"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Website
              </label>
              <input
                id="org-website"
                type="url"
                value={orgData.website}
                onChange={(e) =>
                  setOrgData({ ...orgData, website: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </div>

        {/* Profile Settings */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-2">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Admin Profile
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your personal information
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
