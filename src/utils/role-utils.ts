export interface UserData {
  user: { id: string; email: string };
  organizations: Array<{
    id: string;
    name: string;
    role: "MEMBER" | "ADMIN" | "STAFF";
  }>;
}

export function getUserRoles(user: UserData | null) {
  if (!user?.organizations?.length) return { isMember: false, isStaff: false };

  const roles = {
    isMember: user.organizations.some((org) => org.role === "MEMBER"),
    isStaff: user.organizations.some(
      (org) => org.role === "ADMIN" || org.role === "STAFF",
    ),
  };

  return roles;
}
