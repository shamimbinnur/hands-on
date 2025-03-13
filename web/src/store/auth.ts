import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  loadStoredUser: () => void;
}

// API URL
const API_URL = "http://localhost:5858/api";

// Create auth store
const useAuthStore = create<AuthState>((set, get) => {
  // Initialize auth with stored user data if available
  const storedUser = localStorage.getItem("user");
  const token = Cookies.get("token");

  // Set axios auth header if token exists
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Set initial state
  return {
    // Initial state with stored user if available
    user: storedUser ? JSON.parse(storedUser) : null,
    isLoading: false,
    error: null,

    // Actions
    register: async (name: string, email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password,
        });
        const user = response.data;

        // Save token to cookie
        Cookies.set("token", user.token, { expires: 7 });
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        set({ user, isLoading: false });
        return user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message = error.response?.data?.message || "Registration failed";
        set({ error: message, isLoading: false });
        return null;
      }
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        const user = response.data;

        // Save token to cookie
        Cookies.set("token", user.token, { expires: 7 });
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        set({ user, isLoading: false });
        return user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message = error.response?.data?.message || "Login failed";
        set({ error: message, isLoading: false });
        return null;
      }
    },

    logout: () => {
      // Remove token and user data
      Cookies.remove("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      set({ user: null });
    },

    loadStoredUser: () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      }
    },
  };
});

export default useAuthStore;
