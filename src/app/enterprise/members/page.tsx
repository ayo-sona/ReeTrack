"use client";

import { useState } from "react";
import { MembersTable } from "../../../components/enterprise/MembersTable";
import { MemberFilters } from "../../../components/enterprise/MemberFilters";
import { MOCK_MEMBERS } from "../../../lib/mockData/enterpriseMockdata";
import { UserPlus } from "lucide-react";

export default function MembersPage() {
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    plan: "all",
    status: "all" as "all" | "active" | "inactive" | "expired",
  });

  // Filter members based on current filters
  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    // Search filter - by name or email
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Date range filter - by joined date
    if (filters.dateFrom) {
      const joinedDate = new Date(member.joinedDate);
      const fromDate = new Date(filters.dateFrom);
      if (joinedDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const joinedDate = new Date(member.joinedDate);
      const toDate = new Date(filters.dateTo + 'T23:59:59'); // End of day
      if (joinedDate > toDate) return false;
    }

    // Plan filter - by subscription plan
    if (filters.plan !== "all") {
      if (member.planId !== filters.plan) return false;
    }

    // Status filter - based on your specific definitions:
    // - active: member.status === 'active' (currently subscribed)
    // - inactive: member.status === 'inactive' && membershipType === 'self_signup' (self-signup, not renewed)
    // - expired: member.status === 'expired' && membershipType === 'manual_add' (manual add, not renewed)
    if (filters.status !== "all") {
      if (filters.status === "active") {
        // Active = currently under subscription
        if (member.status !== "active") return false;
      } else if (filters.status === "inactive") {
        // Inactive = self-signup but hasn't renewed (subscription expired)
        if (member.status !== "inactive" || member.membershipType !== "self_signup") {
          return false;
        }
      } else if (filters.status === "expired") {
        // Expired = manual add that wasn't renewed
        if (member.status !== "expired" || member.membershipType !== "manual_add") {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Members Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and monitor all member subscriptions
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <UserPlus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <MemberFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        filteredCount={filteredMembers.length}
        totalCount={MOCK_MEMBERS.length}
      />

      {/* Members Table */}
      <MembersTable members={filteredMembers} />
    </div>
  );
}