"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, User, Shield } from "lucide-react";
import { setCookie } from "cookies-next";

export default function SelectRolePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Fetch user data from your auth context or API
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(user);
  }, []);

  const handleRoleSelect = (role: "member" | "staff") => {
    if (role === "member") {
      router.push("/member/dashboard");
      setCookie("current_role", "MEMBER");
    } else {
      router.push("/select-org");
      setCookie("current_role", "ORG");
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose how you want to continue
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {userData.organizations
            ?.map((org: any) => org.role)
            .includes("MEMBER") && (
            <button
              onClick={() => handleRoleSelect("member")}
              className="group relative w-full flex justify-center items-center p-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <User className="h-12 w-12 text-blue-600 mb-3" />
                <span className="text-lg font-medium text-gray-900">
                  Continue as Member
                </span>
                <p className="mt-1 text-sm text-gray-500 text-center">
                  Access your member dashboard
                </p>
              </div>
            </button>
          )}

          {userData.organizations
            ?.map((org: any) => org.role)
            .includes("STAFF") ||
            (userData.organizations
              ?.map((org: any) => org.role)
              .includes("ADMIN") && (
              <button
                onClick={() => handleRoleSelect("staff")}
                className="group relative w-full flex justify-center items-center p-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Shield className="h-12 w-12 text-purple-600 mb-3" />
                  <span className="text-lg font-medium text-gray-900">
                    Continue as Organization
                  </span>
                  <p className="mt-1 text-sm text-gray-500 text-center">
                    Access organization management
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
