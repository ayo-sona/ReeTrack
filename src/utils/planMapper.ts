import { Plan } from "../lib/organizationAPI/plansApi";
import { SubscriptionPlan } from "../types/organization";
import { Currency } from "../types/common";

/**
 * Maps backend Plan format to frontend SubscriptionPlan format
 */
export const mapPlanToSubscriptionPlan = (plan: Plan): SubscriptionPlan => {
  // ⭐ FIXED: Safely handle features field with proper types
  const getFeaturesArray = (): string[] => {
    if (!plan.features) return [];

    // If features is already an array
    if (Array.isArray(plan.features)) {
      return plan.features as string[];
    }

    return [];
  };

  const featuresArray = getFeaturesArray();

  return {
    id: plan.id,
    organizationId: plan.organization_id,
    name: plan.name,
    description: plan.description || "",
    price: plan.price,
    currency: plan.currency as Currency,
    duration: mapIntervalToDuration(plan.interval),
    features: featuresArray.map((name: string, index: number) => ({
      id: `feature_${plan.id}_${index}`,
      name,
      included: true,
    })),
    subscriptions: plan.subscriptions,
    isActive: plan.is_active,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  };
};

/**
 * Maps backend interval format to frontend duration format
 * ✅ FIXED: Added null/undefined safety check
 */
const mapIntervalToDuration = (
  interval: string | null | undefined,
): "weekly" | "monthly" | "quarterly" | "yearly" => {
  // ✅ Handle null, undefined, or empty string
  if (!interval) return "monthly";

  const mapping: Record<string, "weekly" | "monthly" | "quarterly" | "yearly"> =
    {
      week: "weekly",
      weekly: "weekly",
      month: "monthly",
      monthly: "monthly",
      quarter: "quarterly",
      quarterly: "quarterly",
      year: "yearly",
      yearly: "yearly",
    };

  return mapping[interval.toLowerCase()] || "monthly";
};

/**
 * Maps multiple plans
 */
export const mapPlansToSubscriptionPlans = (
  plans: Plan[],
): SubscriptionPlan[] => {
  if (!Array.isArray(plans)) return [];
  return plans.map(mapPlanToSubscriptionPlan);
};