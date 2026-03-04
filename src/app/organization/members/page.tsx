"use client";

import { useState, useMemo } from "react";
import { MembersTable } from "../../../components/organization/MembersTable";
import { MemberFilters } from "../../../components/organization/MemberFilters";
import { Pagination } from "../../../components/organization/Pagination";
import { UserPlus, AlertCircle } from "lucide-react";
import { useMembers } from "../../../hooks/useMembers";
import { Member } from "../../../types/organization";
import { CreateMemberModal } from "../../../components/organization/CreateMemberModal";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

export default function MembersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    plan: "all",
    status: "all" as "all" | "active" | "inactive",
  });
  const [page, setPage] = useState(1);

  const { data: membersData, isLoading, error } = useMembers(page, PAGE_SIZE);

  const members = useMemo(() => {
    if (!membersData?.data) return [];
    return membersData.data;
  }, [membersData]);

  const meta = useMemo(() => {
    if (!membersData?.meta) {
      return { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 };
    }
    console.log("Meta from API:", membersData.meta); // 👈 Add this
    return membersData.meta;
  }, [membersData]);

  // Client-side filtering (applied to current page only)
  const filteredMembers = useMemo(() => {
    return members.filter((member: Member) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const email = member.user?.email?.toLowerCase() || "";
        const firstName = member.user?.first_name?.toLowerCase() || "";
        const lastName = member.user?.last_name?.toLowerCase() || "";

        if (
          !email.includes(searchTerm) &&
          !firstName.includes(searchTerm) &&
          !lastName.includes(searchTerm)
        ) {
          return false;
        }
      }

      if (filters.dateFrom) {
        const joinedDate = new Date(member.created_at);
        const fromDate = new Date(filters.dateFrom);
        if (joinedDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const joinedDate = new Date(member.created_at);
        const toDate = new Date(filters.dateTo + "T23:59:59");
        if (joinedDate > toDate) return false;
      }
      if (filters.status !== "all") {
        const memberStatus = member.user?.status;
        if (filters.status === "active" && memberStatus !== "active")
          return false;
        if (filters.status === "inactive" && memberStatus !== "inactive")
          return false;
      }
      return true;
    });
  }, [members, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 px-4 text-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-base font-bold text-[#1F2937] mb-1">
          Failed to load members
        </h2>
        <p className="text-sm text-[#1F2937]/60 mb-5">
          Something went wrong. Please try again.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F2937]">Members</h1>
          <p className="text-sm text-[#1F2937]/60 mt-0.5">
            Manage and monitor all member subscriptions
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      {!isLoading && meta && meta.total > 0 && (
        <div className="bg-[#0D9488]/5 border border-[#0D9488]/10 rounded-xl px-4 py-3">
          <p className="text-sm text-[#0D9488] font-semibold">
            Showing {members.length} of {meta.total} total members
          </p>
        </div>
      )}

      {/* Filters */}
      <MemberFilters
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredMembers.length}
        totalCount={members.length}
        isLoading={isLoading}
      />

      {/* Table */}
      <MembersTable
        members={filteredMembers}
        isSearching={filters.search.length > 0}
        isLoading={isLoading}
      />
      
      {!isLoading && meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Create modal */}
      <CreateMemberModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}