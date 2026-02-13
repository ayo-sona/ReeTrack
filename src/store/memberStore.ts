import { create } from "zustand";

interface MemberState {
  members: Record<string, any>; // key: orgId, value: memberData
  setMember: (orgId: string, data: any) => void;
  getMember: (orgId: string) => any;
  clearMember: (orgId: string) => void;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: {},

  setMember: (orgId, data) =>
    set((state) => ({
      members: { ...state.members, [orgId]: data },
    })),

  getMember: (orgId) => get().members[orgId],

  clearMember: (orgId) =>
    set((state) => {
      const { [orgId]: _, ...rest } = state.members;
      return { members: rest };
    }),
}));
