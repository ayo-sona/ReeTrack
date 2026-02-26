import { getCookie } from "cookies-next";

export interface UserData {
  user: { id: string; email: string };
  organizations: Array<{
    id: string;
    name: string;
    role: "MEMBER" | "ADMIN" | "STAFF";
  }>;
}

export function getUserRoles(user: UserData | null) {
  if (!user?.organizations?.length) return { isMember: false, isOrg: false };

  const roles = {
    isMember: user.organizations.some((org) => org.role === "MEMBER"),
    isOrg: user.organizations.some(
      (org) => org.role === "ADMIN" || org.role === "STAFF",
    ),
  };

  return roles;
}

export function isStaff(): boolean {
  const currentRole = getCookie("current_role");
  return currentRole === "STAFF";
}

export function isAdmin(): boolean {
  const currentRole = getCookie("current_role");
  return currentRole === "ADMIN";
}

export function isStaffOrAdmin(): boolean {
  const currentRole = getCookie("current_role");
  return currentRole === "STAFF" || currentRole === "ADMIN";
}