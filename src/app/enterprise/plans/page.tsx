'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { PlansGrid } from '../../../components/enterprise/PlansGrid';
import { CreatePlanModal } from '../../../components/enterprise/CreatePlanModal';
import { MOCK_PLANS } from '../../../lib/mockData/enterpriseMockdata';
import { SubscriptionPlan } from '../../../types/enterprise';

interface PlanFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  visibility: string;
  features: Array<{ id: string; name: string; included: boolean }>;
}

const STORAGE_KEY = 'enterprise_plans';

export default function PlansPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Always start with MOCK_PLANS for SSR
  const [plans, setPlans] = useState<SubscriptionPlan[]>(MOCK_PLANS);

  // Load from localStorage after mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setPlans(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse stored plans:', e);
        }
      }
    }
  }, []); // Only run once on mount

  // Save plans to localStorage whenever they change
  const savePlansToStorage = useCallback((plansToSave: SubscriptionPlan[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plansToSave));
    }
  }, []);

  // Sync to localStorage when plans change (only after client mount)
  useEffect(() => {
    if (isClient) {
      savePlansToStorage(plans);
    }
  }, [plans, isClient, savePlansToStorage]);

  // Handle creating new plan
  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowCreateModal(true);
  };

  // Handle editing existing plan
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowCreateModal(true);
  };

  // Handle activating/deactivating plan
  const handleTogglePlanStatus = (planId: string, currentStatus: boolean) => {
    setPlans(plans.map(p => 
      p.id === planId 
        ? { ...p, isActive: !currentStatus, updatedAt: new Date().toISOString() }
        : p
    ));
    console.log(`${currentStatus ? 'Deactivated' : 'Activated'} plan:`, planId);
    // TODO: Call your API to update plan status
  };

  // Handle deleting plan (completely remove from database)
  const handleDeletePlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (confirm(`Are you sure you want to permanently delete "${plan?.name}"? This action cannot be undone.`)) {
      setPlans(plans.filter(p => p.id !== planId));
      console.log('Deleted plan:', planId);
      // TODO: Call your API to delete the plan
    }
  };

  // Handle saving plan (create or update)
  const handleSavePlan = (planData: PlanFormData) => {
    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(p => 
        p.id === editingPlan.id 
          ? { 
              ...p, 
              name: planData.name,
              description: planData.description,
              price: parseFloat(planData.price),
              duration: planData.duration as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
              visibility: planData.visibility as 'public' | 'invite_only',
              features: planData.features,
              updatedAt: new Date().toISOString() 
            }
          : p
      ));
      console.log('Updated plan:', editingPlan.id, planData);
    } else {
      // Create new plan
      const newPlan: SubscriptionPlan = {
        id: `plan_${Date.now()}`,
        enterpriseId: 'ent_001',
        name: planData.name,
        description: planData.description,
        price: parseFloat(planData.price),
        currency: 'NGN',
        duration: planData.duration as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
        visibility: planData.visibility as 'public' | 'invite_only',
        features: planData.features,
        isActive: true,
        memberCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans([...plans, newPlan]);
      console.log('Created plan:', newPlan);
    }
    setShowCreateModal(false);
    setEditingPlan(null);
  };

  // Reset to original mock data (useful for testing)
  const handleResetPlans = () => {
    if (confirm('Reset all plans to original mock data? This will delete all your changes.')) {
      setPlans(MOCK_PLANS);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

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
        <div className="flex items-center gap-2">
          {/* Reset Button (for development) */}
          <button
            onClick={handleResetPlans}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset Plans
          </button>
          
          {/* Create Plan Button */}
          <button
            onClick={handleCreatePlan}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Stats - suppressHydrationWarning for dynamic values */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100" suppressHydrationWarning>
            {plans.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Plans</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100" suppressHydrationWarning>
            {plans.filter(p => p.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100" suppressHydrationWarning>
            {plans.reduce((sum, p) => sum + p.memberCount, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Price</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100" suppressHydrationWarning>
            ₦{plans.length > 0 ? (plans.reduce((sum, p) => sum + p.price, 0) / plans.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <PlansGrid 
        plans={plans}
        onEditPlan={handleEditPlan}
        onTogglePlanStatus={handleTogglePlanStatus}
        onDeletePlan={handleDeletePlan}
      />

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
    </div>
  );
}