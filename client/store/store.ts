import { User } from "@/components/dashboard";
import { create } from "zustand";
import { getCurrentUser } from "@/services/auth";

export interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUser: (force?: boolean) => Promise<void>;
  clearUser: () => void;
}

export const userStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchUser: async (force = false) => {
    const { user } = get();

    if (user && !force) {
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await getCurrentUser();
      if (response.success && response.data) {
        set({ user: response.data, isLoading: false, error: null });
      } else {
        set({ error: "Failed to load user data", isLoading: false });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load user data",
        isLoading: false,
      });
    }
  },
  clearUser: () => set({ user: null, error: null }),
}));
