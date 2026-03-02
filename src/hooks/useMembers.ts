// hooks/useMembers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi, UpdateMemberDto } from "../lib/organizationAPI/membersApi";
import { Member } from "@/types/organization"; // ✅ Add this import

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
export const useMemberById = (id: string) => {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => membersApi.getById(id),
    enabled: !!id,
    retry: false,
  });
};

// Get member stats
export const useMemberStats = (id: string) => {
  return useQuery({
    queryKey: ["member", id, "stats"],
    queryFn: () => membersApi.getStats(id),
    enabled: !!id,
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