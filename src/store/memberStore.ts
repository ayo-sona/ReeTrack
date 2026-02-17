import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MemberState {
  members: Record<string, any>; // key: orgId, value: memberData
  setMember: (orgId: string, data: any) => void;
  getMember: (orgId: string) => any;
  clearMember: (orgId: string) => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "member-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // or sessionStorage for session-only persistence
    },
  ),
);
