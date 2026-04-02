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
  ): Promise<MembersResponse> => {
    const response = await apiClient.get("/members", {
      params: { page, limit, status },
    });
    return response.data.data;
  },

  // Get member by ID
  getById: async (
    memberId: string | null,
    organizationId: string | null,
  ): Promise<Member> => {
    const response = await apiClient.get(
      `/members/${memberId}/${organizationId}`,
    );
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

  // Get member stats (own stats, no path param)
  getStats: async () => {
    const response = await apiClient.get("/members/stats");
    return response.data.data;
  },

  // Get leaderboard stats for an organization
  getLeaderboardStats: async (organizationId: string): Promise<Member[]> => {
    const response = await apiClient.get(`/members/${organizationId}/stats`);
    return response.data.data;
  },
};