"use client";

import { useState, useMemo } from "react";
import { Plus, Users, TrendingUp } from "lucide-react";
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
  const [viewingPlanMembers, setViewingPlanMembers] = useState<SubscriptionPlan | null>(null);

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
      if (search && !plan.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (filters.status !== "all") {
        if (filters.status === "active" && !plan.isActive) return false;
        if (filters.status === "inactive" && plan.isActive) return false;
      }

      if (filters.duration !== "all" && plan.duration !== filters.duration) {
        return false;
      }

      if (filters.priceMin !== "") {
        const minPrice = parseFloat(filters.priceMin);
        if (plan.price < minPrice) return false;
      }

      if (filters.priceMax !== "") {
        const maxPrice = parseFloat(filters.priceMax);
        if (plan.price > maxPrice) return false;
      }

      return true;
    });
  }, [allPlans, search, filters]);

  const stats = {
    total: allPlans.length,
    active: allPlans.filter((p) => p.isActive).length,
    totalMembers: allPlans.reduce((sum, p) => sum + (p.memberCount || 0), 0),
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

  const handleViewMembers = (plan: SubscriptionPlan) => {
    setViewingPlanMembers(plan);
  };

  const handleTogglePlanStatus = async (planId: string) => {
    try {
      await togglePlan.mutateAsync(planId);
    } catch (error) {
      console.error("Failed to toggle plan status:", error);
      alert("Failed to update plan status");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    const plan = allPlans.find((p) => p.id === planId);
    if (
      confirm(
        `Are you sure you want to permanently delete "${plan?.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deletePlan.mutateAsync(planId);
      } catch (error) {
        console.error("Failed to delete plan:", error);
        alert("Failed to delete plan");
      }
    }
  };

  const handleSavePlan = async (planData: PlanFormData) => {
    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({
          id: editingPlan.id,
          data: {
            name: planData.name,
            description: planData.description,
            amount: parseFloat(planData.price),
            currency: "NGN",
            interval: planData.duration as
              | "daily"
              | "weekly"
              | "monthly"
              | "yearly",
            intervalCount: 1,
            features: planData.features,
          },
        });
      } else {
        await createPlan.mutateAsync({
          name: planData.name,
          description: planData.description,
          amount: parseFloat(planData.price),
          currency: "NGN",
          interval: planData.duration as
            | "daily"
            | "weekly"
            | "monthly"
            | "yearly",
          intervalCount: 1,
          features: planData.features,
        });
      }
      setShowCreateModal(false);
      setEditingPlan(null);
    } catch (error) {
      console.error("Failed to save plan:", error);
      alert("Failed to save plan");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 dark:text-red-400 mb-4">
          Failed to load plans
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and manage your membership plans
          </p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Plans
            </p>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p
            className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100"
            suppressHydrationWarning
          >
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Plans
            </p>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p
            className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100"
            suppressHydrationWarning
          >
            {stats.active}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Members
            </p>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p
            className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100"
            suppressHydrationWarning
          >
            {stats.totalMembers}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Price</p>
          <p
            className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100"
            suppressHydrationWarning
          >
            ₦
            {stats.avgPrice.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search plans by name..."
      />

      {/* Filters */}
      <PlanFilters
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredPlans.length}
        totalCount={allPlans.length}
      />

      {/* Plans Grid */}
      <PlansGrid
        plans={filteredPlans}
        onEditPlan={handleEditPlan}
        onTogglePlanStatus={handleTogglePlanStatus}
        onDeletePlan={handleDeletePlan}
        onViewMembers={handleViewMembers}
      />

      {/* Empty State */}
      {filteredPlans.length === 0 && allPlans.length > 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No plans match your filters. Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Create/Edit Plan Modal */}
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
      />

      {/* View Members Modal */}
      <PlanMembersModal
        isOpen={!!viewingPlanMembers}
        onClose={() => setViewingPlanMembers(null)}
        plan={viewingPlanMembers}
      />
    </div>
  );
}