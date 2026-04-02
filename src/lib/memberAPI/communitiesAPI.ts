import apiClient from "../apiClient";

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
  created_at: string;
  updated_at: string;
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