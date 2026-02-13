"use client";

import { Building2, MapPin } from "lucide-react";
import { useMemberOrgs } from "@/hooks/memberHook/useMember";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/store/memberStore";
import { Member } from "@/types/memberTypes/member";
import React, { useMemo, useCallback } from "react";

export default function MyCommunityPage() {
  const router = useRouter();
  const { data: memberDetails, isLoading } = useMemberOrgs();
  const setMember = useMemberStore((state) => state.setMember);
  //   const { setMember } = useMemberStore();

  // Memoize organizations computation
  const organizations = useMemo(() => {
    if (!memberDetails || memberDetails.length === 0) return [];

    const organizationMap = new Map<string, Member>();
    memberDetails.forEach((member) => {
      const orgId = member.organization_user?.organization_id;
      if (orgId && !organizationMap.has(orgId)) {
        organizationMap.set(orgId, member);
      }
    });

    return Array.from(organizationMap.entries()).map(([orgId, member]) => {
      const org = member.organization_user?.organization;

      // Move setMember outside of render - call it in useEffect instead
      return {
        id: orgId,
        name: org?.name,
        description: org?.description,
        address: org?.address,
        email: org?.email,
        phone: org?.phone,
        website: org?.website,
        member, // Store member for later use
      };
    });
  }, [memberDetails]);

  // Handle navigation with useCallback
  const handleOrgClick = useCallback(
    (orgId: string, member: Member) => {
      setMember(orgId, member);
      router.push(`/member/check-ins/${orgId}`);
    },
    [router, setMember],
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!memberDetails || memberDetails.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-ins</h1>
          <p className="text-gray-600 mt-1">Organizations you have access to</p>
        </div>

        {/* Organizations List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <OrganizationCard
              key={org.id}
              org={org}
              onClick={() => handleOrgClick(org.id, org.member)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Extracted components to prevent re-renders
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto animate-pulse space-y-6">
      <div className="h-12 bg-gray-200 rounded w-64"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Organizations Available
        </h3>
        <p className="text-gray-600">
          You don&apos;t have access to any organizations yet.
        </p>
      </div>
    </div>
  </div>
);

// Memoized card component
const OrganizationCard = React.memo<{
  org: {
    id: string;
    name?: string;
    description?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  onClick: () => void;
}>(({ org, onClick }) => (
  <div onClick={onClick}>
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-200 cursor-pointer group h-full">
      {/* Organization Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
          {org.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Organization Info */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {org.name}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {org.description}
      </p>

      {/* Contact Info */}
      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{org.address}</span>
        </div>
        <p className="truncate">{org.email}</p>
        <p className="truncate">{org.phone}</p>
      </div>
    </div>
  </div>
));

OrganizationCard.displayName = "OrganizationCard";
