// hooks/useMembers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi, UpdateMemberDto } from "../lib/organizationAPI/membersApi";
import { Member } from "@/types/organization";

interface MembersResponse {
  data: Member[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all members with pagination
export const useMembers = (
  page: number = 1,
  limit: number = 10,
  status?: string,
) => {
  return useQuery<MembersResponse>({
    queryKey: ["members", page, limit, status],
    queryFn: () => membersApi.getAll(page, limit, status),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};

// Get member by ID
export const useMemberById = (
  memberId: string | null,
  organizationId: string | null,
) => {
  return useQuery({
    queryKey: ["member", memberId, organizationId],
    queryFn: () => membersApi.getById(memberId, organizationId),
    enabled: !!organizationId,
    retry: false,
  });
};

// Get member stats (own stats)
export const useMemberStats = () => {
  return useQuery({
    queryKey: ["member", "stats"],
    queryFn: () => membersApi.getStats(),
    retry: false,
  });
};

// Get leaderboard stats for an organization
export const useLeaderboardStats = (organizationId: string) => {
  return useQuery<Member[]>({
    queryKey: ["leaderboard", organizationId],
    queryFn: () => membersApi.getLeaderboardStats(organizationId),
    enabled: !!organizationId,
    retry: false,
  });
};

// Update member
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberDto }) =>
      membersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["member", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

// Delete member
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};