import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (identifier, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", {
            identifier,
            password,
          });
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Set token in API headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          return true;
        } catch (error) {
          const message = error.response?.data?.message || "Login failed";
          set({ isLoading: false, error: message });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", userData);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          return true;
        } catch (error) {
          const message =
            error.response?.data?.message || "Registration failed";
          set({ isLoading: false, error: message });
          return false;
        }
      },

      // OAuth login handler
      setAuthFromOAuth: async (token) => {
        set({ isLoading: true, error: null });
        try {
          // Set token in headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user data
          const response = await api.get("/auth/me");
          const user = response.data.user;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          delete api.defaults.headers.common["Authorization"];
          const message = error.response?.data?.message || "OAuth login failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        delete api.defaults.headers.common["Authorization"];
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      fetchUser: async () => {
        try {
          const response = await api.get("/auth/me");
          set({ user: response.data.user });
          return response.data.user;
        } catch (error) {
          return null;
        }
      },

      // Initialize auth from storage
      initAuth: () => {
        const token = get().token;
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth on load
useAuthStore.getState().initAuth();
