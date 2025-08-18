import { authCheckStatus, authLogin } from "@/apis/users/accions/auth-accions";
import { User } from "@/interfaces/auth/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<AuthResponse | null>;
  checkStatus: () => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, user?: User) => Promise<boolean>;
  hasHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: "checking",
      token: undefined,
      user: undefined,
      hasHydrated: false,

      changeStatus: async (token?: string, user?: User) => {
        if (!token || !user) {
          set({ status: "unauthenticated", token: undefined, user: undefined });
          return false;
        }
        set({ status: "authenticated", token, user });
        return true;
      },

      login: async (email: string, password: string) => {
        try {
          const resp = await authLogin(email, password);
          if (!resp?.token || !resp.user) return null;
          const success = await get().changeStatus(resp.token, resp.user);
          return success ? resp : null;
        } catch {
          return null;
        }
      },

      checkStatus: async () => {
        try {
          const resp = await authCheckStatus();
          if (!resp) {
            await get().changeStatus();
            return null;
          }
          await get().changeStatus(resp.token, resp.user);
          return resp;
        } catch {
          return null;
        }
      },

      logout: async () => {
        set({ status: "unauthenticated", token: undefined, user: undefined });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        status: state.status,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
