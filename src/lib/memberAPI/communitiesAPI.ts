import apiClient from "../apiClient";

export interface OrgPlan {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string | null;
  interval_count: number | null;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrgListing {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  price: string; // API returns numeric string e.g. "20000.00"
  currency: string;
  status: string;
  image_url: string | null;
  image_public_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: "active" | "inactive";
  address?: string | null;
  website?: string | null;
  phone?: string | null;
  description?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  member_plans?: OrgPlan[];
  marketplace_listings?: OrgListing[];
}

export const communitiesApi = {
  getAll: async (): Promise<Community[]> => {
    const response = await apiClient.get("/organizations/all");
    return response.data.data;
  },

  getById: async (organizationId: string): Promise<Community> => {
    const response = await apiClient.get(`/organizations/select/${organizationId}`);
    return response.data.data;
  },
};