"use client";

import { useState, useMemo } from "react";
import { Plus, Users, TrendingUp, AlertCircle } from "lucide-react";
import { PlansGrid } from "../../../components/organization/PlansGrid";
import { CreatePlanModal } from "../../../components/organization/CreatePlanModal";
import { PlanMembersModal } from "../../../components/organization/PlansMembersModal";
import { SearchBar } from "../../../components/organization/PlanSearchBar";
import { PlanFilters } from "../../../components/organization/PlanFilters";
import {
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useTogglePlan,
} from "../../../hooks/usePlans";
import { SubscriptionPlan } from "../../../types/organization";
import { mapPlansToSubscriptionPlans } from "../../../utils/planMapper";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PlanFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
}

export default function PlansPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [viewingPlanMembers, setViewingPlanMembers] =
    useState<SubscriptionPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all" as "all" | "active" | "inactive",
    duration: "all" as "all" | "weekly" | "monthly" | "quarterly" | "yearly",
    priceMin: "",
    priceMax: "",
  });

  const { data: plansResponse, isLoading, error } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const togglePlan = useTogglePlan();

  const allPlans = useMemo(
    () =>
      plansResponse?.data
        ? mapPlansToSubscriptionPlans(plansResponse.data)
        : [],
    [plansResponse],
  );

  const filteredPlans = useMemo(() => {
    return allPlans.filter((plan) => {
      if (search && !plan.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filters.status !== "all") {
        if (filters.status === "active" && !plan.isActive) return false;
        if (filters.status === "inactive" && plan.isActive) return false;
      }
      if (filters.duration !== "all" && plan.duration !== filters.duration)
        return false;
      if (filters.priceMin !== "" && plan.price < parseFloat(filters.priceMin))
        return false;
      if (filters.priceMax !== "" && plan.price > parseFloat(filters.priceMax))
        return false;
      return true;
    });
  }, [allPlans, search, filters]);

  const stats = {
    total: allPlans.length,
    active: allPlans.filter((p) => p.isActive).length,
    totalMembers: allPlans.reduce(
      (sum, p) => sum + (p.subscriptions?.length || 0),
      0,
    ),
    avgPrice:
      allPlans.length > 0
        ? allPlans.reduce((sum, p) => sum + p.price, 0) / allPlans.length
        : 0,
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowCreateModal(true);
  };
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowCreateModal(true);
  };
  const handleViewMembers = (plan: SubscriptionPlan) =>
    setViewingPlanMembers(plan);

  const handleTogglePlanStatus = async (planId: string) => {
    try {
      await togglePlan.mutateAsync(planId);
      toast.success("Plan status updated");
    } catch {
      toast.error("Failed to update plan status");
    }
  };

  const handleDeletePlan = (planId: string) => {
    // Show inline confirm instead of browser confirm()
    setDeletingPlanId(planId);
  };

  const confirmDelete = async () => {
    if (!deletingPlanId) return;
    try {
      await deletePlan.mutateAsync(deletingPlanId);
      toast.success("Plan deleted successfully");
    } catch {
      toast.error("Failed to delete plan");
    } finally {
      setDeletingPlanId(null);
    }
  };

  const handleSavePlan = async (planData: PlanFormData) => {
    try {
      const payload = {
        name: planData.name,
        description: planData.description,
        price: parseFloat(planData.price),
        currency: "NGN",
        interval: planData.duration as
          | "weekly"
          | "monthly"
          | "yearly"
          | "quarterly",
        intervalCount: 1,
        features: planData.features,
      };

      if (editingPlan) {
        await updatePlan.mutateAsync({
          id: editingPlan.id,
          data: payload,
        });
        toast.success("Plan updated successfully");
      } else {
        await createPlan.mutateAsync(payload);
        toast.success("Plan created successfully");
      }

      setShowCreateModal(false);
      setEditingPlan(null);
    } catch (error: any) {
      console.log(error.response);
      const { data } = error.response;
      toast.error(data.message || "Failed to save plan. Please try again.");
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading plans...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center font-[Nunito,sans-serif]">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-base font-bold text-[#1F2937] mb-1">
          Failed to load plans
        </p>
        <p className="text-sm text-[#9CA3AF] mb-4">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const deletingPlan = allPlans.find((p) => p.id === deletingPlanId);

  return (
    <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
              Plans
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
              Subscription Plans
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Create and manage your membership plans
            </p>
          </div>
          <Button
            variant="default"
            size="default"
            onClick={handleCreatePlan}
            className="w-full sm:w-auto self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        {/* 2 cols on mobile → 4 cols on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Total Plans",
              value: stats.total,
              icon: <TrendingUp className="w-4 h-4 text-[#0D9488]" />,
            },
            {
              label: "Active Plans",
              value: stats.active,
              icon: <span className="w-2 h-2 bg-emerald-500 rounded-full" />,
            },
            {
              label: "Subscribed Members",
              value: stats.totalMembers,
              icon: <Users className="w-4 h-4 text-[#0D9488]" />,
            },
            {
              label: "Avg. Price",
              value: `₦${stats.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              icon: null,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4 sm:py-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide leading-tight">
                  {label}
                </p>
                {icon}
              </div>
              <p
                className="text-xl sm:text-2xl font-extrabold text-[#1F2937]"
                suppressHydrationWarning
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search plans by name..."
        />

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <PlanFilters
          filters={filters}
          onFiltersChange={setFilters}
          filteredCount={filteredPlans.length}
          totalCount={allPlans.length}
        />

        {/* ── Plans Grid ───────────────────────────────────────────────────── */}
        <PlansGrid
          plans={filteredPlans}
          onEditPlan={handleEditPlan}
          onTogglePlanStatus={handleTogglePlanStatus}
          onDeletePlan={handleDeletePlan}
          onViewMembers={handleViewMembers}
        />

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {filteredPlans.length === 0 && allPlans.length > 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm px-4">
            <p className="text-sm font-bold text-[#1F2937] mb-1">
              No plans match your filters
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deletingPlanId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
          onClick={() => setDeletingPlanId(null)}
        >
          <div
            className="bg-white rounded-xl border border-gray-100 shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-extrabold text-[#1F2937] mb-1">
              Delete plan
            </h2>
            <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-[#1F2937]">
                &quot;{deletingPlan?.name}&quot;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletingPlanId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmDelete}
                disabled={deletePlan.isPending}
              >
                {deletePlan.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit modal ───────────────────────────────────────────── */}
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
      />

      {/* ── View members modal ────────────────────────────────────────────── */}
      <PlanMembersModal
        isOpen={!!viewingPlanMembers}
        onClose={() => setViewingPlanMembers(null)}
        plan={viewingPlanMembers}
      />
    </div>
  );
}
