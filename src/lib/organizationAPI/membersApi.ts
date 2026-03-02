import apiClient from "../apiClient";
import { Member } from "../../types/organization";

export interface UpdateMemberDto {
  date_of_birth?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  metadata?: Record<string, unknown>;
}

// ✅ Add response interface
interface MembersResponse {
  data: Member[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const membersApi = {
  // Get all members
  getAll: async (
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<MembersResponse> => { // ✅ Changed return type
    const response = await apiClient.get("/members", {
      params: { page, limit, status },
    });
    // ✅ Return the full object with data and meta
    return response.data.data; // This should have { data: [...], meta: {...} }
  },

  // Get member by ID
  getById: async (id: string): Promise<Member> => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data.data;
  },

  // Update member
  update: async (id: string, data: UpdateMemberDto): Promise<Member> => {
    const response = await apiClient.put(`/members/${id}`, data);
    return response.data.data;
  },

  // Delete member
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/members/${id}`);
  },

  // Get member stats
  getStats: async (id: string) => {
    const response = await apiClient.get(`/members/${id}/stats`);
    return response.data.data;
  },
};