import {
  loginInpt,
  signupInpt,
  UserState,
  UpdateProfileInput,
} from "@/types/UserTypes";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_ENDPOINT = "http://localhost:5401/api/v1/auth";
axios.defaults.withCredentials = true;

export const UserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthentiacte: false,
      loading: false,
      user: null,
      isAdmin: false,
      isCheckAuth: true,

      //   Methods
      signup: async (input: signupInpt) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_ENDPOINT}/regester`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          toast.error(response.data);

          if (response.data.success) {
            set({
              user: response.data.user, // Set user data
              loading: false,
              isAuthentiacte: true,
              isCheckAuth: false,
              // Set authentication state to true
            });
          }
          return true;
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data.message || "An error occurred");
          set({ loading: false });
        }
      },
      login: async (input: loginInpt) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_ENDPOINT}/login`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            set({
              user: response.data.user,
              loading: false,
              isAuthentiacte: true,
            });
          }
          return true;
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          set({ loading: false });
          toast.error(err.response?.data?.message || "An error occurred");
          toast.error(err.message);
        }
      },

      verifyOtp: async (verificationCode: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_ENDPOINT}/verify-email`,
            { verificationCode },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              isAuthentiacte: true,
              loading: false,
              user: response.data.user,
            });
          }
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          set({ loading: false });
          toast.error(err.response?.data?.message || "An error occurred");
          toast.error(err.message);
        }
      },
      CheckingAuth: async () => {
        try {
          set({ isCheckAuth: true }); // Start checking
          const response = await axios.get(`${API_ENDPOINT}/check-auth`);

          if (response.data.success) {
            toast.success("You are Authenticated");
            set({
              isAuthentiacte: true,
              user: response.data.user,
              isCheckAuth: false, // Auth check complete
            });
          }
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          toast.error("Authentication check failed");
          console.error("Error in CheckingAuth:", err.message);
          set({ isCheckAuth: false, isAuthentiacte: false });
        }
      },

      logout: async () => {
        try {
          const response = await axios.post(`${API_ENDPOINT}/logout`);

          if (response.data.success) {
            // Clear authentication token (e.g., from localStorage or cookies)
            localStorage.removeItem("token");

            // Update state to reflect logout
            set({
              isAuthentiacte: false,
              user: null,
              isAdmin: false,
            });

            // Show success message
            toast.success("Logout Successfully");
          }
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data?.message || "An error occurred");
          toast.error(err.message);
        }
      },

      forgetPassword: async (
        email: string,
        fullname: string,
        password: string
      ) => {
        try {
          set({ loading: true });
          const res = await axios.post(`${API_ENDPOINT}/forgot-password`, {
            email,
            fullname,
            newPassword: password,
          });
          if (res.data.success) {
            toast.success(res.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data?.message || "An error occurred");
          toast.error(err.message);
          set({ loading: false });
        }
      },

      updateProfile: async (input: UpdateProfileInput) => {
        try {
          const response = await axios.put(
            `${API_ENDPOINT}/profile/update`,
            { ...input, timestamp: new Date().toISOString() },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthentiacte: true });
          }
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data?.message || "An error occurred");
        }
      },

      // admin

      CaptainSignupApi: async (input: signupInpt) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_ENDPOINT}/captain-regester`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            set({
              user: response.data.captain,
              loading: false,
              isAuthentiacte: true,
              isAdmin: true,
              isCheckAuth: false,
            });
          }
          return true;
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          set({ loading: false });
          toast.error(err.response?.data?.message || "An error occurred");
          throw err;
        }
      },
      CaptainLoginApi: async (input: loginInpt) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_ENDPOINT}/captain-login`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            set({
              user: response.data.captain,
              loading: false,
              isAdmin: true,
              isAuthentiacte: true,
              isCheckAuth: false,
            });
          }

          return true;
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          set({ loading: false });
          toast.error(err.response?.data?.message || "An error occurred");
          throw err;
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
