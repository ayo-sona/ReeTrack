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

interface LeaderboardUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatarUrl: string | null; 
}

export interface LeaderboardMemberRaw {
  id: string;
  checked_in_at: string[] | null;
  check_in_count?: number;
  user: LeaderboardUser;
  streakInfo?: {
    currentStreak: number;
    longestStreak: number;
    currentWeekCheckIns: number;
    isStreakActive: boolean;
    streakStartDate: string | null;
    weeksWithCheckIns: Array<{
      weekStart: string;
      weekEnd: string;
      checkInCount: number;
      meetsRequirement: boolean;
    }>;
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
    staleTime: 3 * 60 * 1000, // 3 min
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