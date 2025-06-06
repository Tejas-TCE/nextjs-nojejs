import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_URL = `${BASE_URL}/auth`;
const FAQ_URL = `${BASE_URL}/faq`;

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,

      faqs: [], // Stores FAQ data
        // pagene
        totalFAQs: 0,
        currentPage: 1,
        totalPages: 50,

      // ✅ LOGIN FUNCTION
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          console.log("Attempting login with:", credentials.email);
          const response = await axios.post(`${API_URL}/login`, credentials);
          console.log("Login response:", response.data);

          // Ensure we have the required data
          if (!response.data || !response.data.token) {
            throw new Error("Invalid response format from server");
          }

          set({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token,
            loading: false,
            error: null,
          });

          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");

          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          console.log("Error response data:", error.response?.data);
          console.log("Error status:", error.response?.status);
          
          const errorMessage = error.response?.data?.message || 
                              (error.message || 'Login failed');
          
          set({
            loading: false,
            error: errorMessage,
          });

          toast.error(errorMessage);
          return { success: false, message: errorMessage };
        }
      },

      // ✅ REGISTER FUNCTION
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/register`, userData);

          set({ loading: false, error: null });
          toast.success(response.data.message || "Registration successful!");
          return { success: true, message: response.data.message };
        } catch (error) {
          const errorMsg = error.response?.data?.message || 'Registration failed';
          set({
            loading: false,
            error: errorMsg,
          });

          toast.error(errorMsg);
          return { success: false, message: errorMsg };
        }
      },

      // ✅ LOGOUT FUNCTION
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
        localStorage.removeItem("token");
        toast.info("You have been logged out");
        //   
      },

      // ✅ CHANGE PASSWORD FUNCTION
      changePassword: async (passwordData) => {
        set({ loading: true, error: null });
        try {
          const token = get().token;
          const response = await axios.post(`${API_URL}/change-password`, passwordData, {
            headers: {
              'Authorization': token,
            },
          },{ withCredentials: true });

          set({ loading: false, error: null });
          toast.success(response.data.message || "Password changed successfully!");
          return { success: true, message: response.data.message };
        } catch (error) {
          const errorMsg = error.response?.data?.message || 'Password change failed';
          set({
            loading: false,
            error: errorMsg,
          });

          toast.error(errorMsg);
          return { success: false, message: errorMsg };
        }
      },

      setUser: (userData) => {
        set({ user: userData });
      },

      checkAuth: async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Checking auth with token:", token ? "Token exists" : "No token");
            
            if (!token) {
                set({ isAuthenticated: false, token: null });
                return false;
            }

            // Verify token with backend
            const response = await axios.post(`${API_URL}/verify-token`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Token verification response:", response.data);

            if (response.data.valid) {
                set({
                    isAuthenticated: true,
                    token: token,
                    user: response.data.user
                });
                return true;
            }

            // If token is invalid, clear it
            localStorage.removeItem("token");
            set({ isAuthenticated: false, token: null, user: null });
            toast.error("Session expired. Please login again.");
            return false;
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            set({ isAuthenticated: false, token: null, user: null });
            toast.error("Authentication failed. Please login again.");
            return false;
        }
    },

    fetchFAQs: async (page = 1, limit = 10, search = "", showDeleted = false) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again.");

        const params = {
          page,
          limit,
          search: search || undefined, // Only send if not empty
          showDeleted // Keep showDeleted parameter
        };

        const response = await axios.get(`${FAQ_URL}/faqall`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set({
          faqs: response.data.faqs || [],
          totalFAQs: response.data.totalFAQs,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          loading: false,
        });
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to fetch FAQs";
        set({
          loading: false,
          error: errorMsg,
        });
        toast.error(errorMsg);
      }
    },

    // ✅ ADD FAQ FUNCTION (POST REQUEST)
    addFAQ: async (faqData) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again.");

        const response = await axios.post(`${FAQ_URL}/add`, faqData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          faqs: [...state.faqs, response.data.faq],
          loading: false,
        }));

        toast.success("FAQ added successfully");
        return { success: true, message: "FAQ added successfully" };
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to add FAQ';
        set({ loading: false, error: errorMsg });
        
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    },

    // Add deleteFAQ function
    deleteFAQ: async (id) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again.");

        await axios.delete(`${FAQ_URL}/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          faqs: state.faqs.filter((faq) => faq._id !== id),
          loading: false,
        }));

        toast.success("FAQ permanently deleted");
        return { success: true, message: "FAQ permanently deleted" };
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to delete FAQ";
        set({ 
          loading: false, 
          // error: errorMsg 
        });
        
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    },
    
    // Add softDeleteFAQ function
    softDeleteFAQ: async (id) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again.");

        const response = await axios.put(`${FAQ_URL}/soft-delete/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          faqs: state.faqs.filter((faq) => faq._id !== id),
          loading: false,
        }));

        toast.info("FAQ moved to trash");
        return { success: true, message: "FAQ moved to trash" };
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to move FAQ to trash";
        set({ 
          loading: false, 
          // error: errorMsg 
        });
        
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    },
    
    // Add restoreFAQ function
    restoreFAQ: async (id) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again.");

        const response = await axios.put(`${FAQ_URL}/restore/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Refetch FAQs to get the updated list
        const faqsResponse = await axios.get(`${FAQ_URL}/faqall?showDeleted=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set({
          faqs: faqsResponse.data.faqs || [],
          totalFAQs: faqsResponse.data.totalFAQs,
          currentPage: faqsResponse.data.currentPage,
          totalPages: faqsResponse.data.totalPages,
          loading: false,
        });

        toast.success("FAQ restored successfully");
        return { success: true, message: "FAQ restored successfully" };
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to restore FAQ";
        set({ 
          loading: false, 
          error: errorMsg 
        });
        
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    },
    
    // Add editFAQ function
    editFAQ: async (id, faqData) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again.");

        const response = await axios.put(`${FAQ_URL}/edit/${id}`, faqData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          faqs: state.faqs.map((faq) => 
            faq._id === id ? response.data.faq : faq
          ),
          loading: false,
        }));

        toast.success("FAQ updated successfully");
        return { success: true, message: "FAQ updated successfully" };
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to update FAQ';
        set({ loading: false, error: errorMsg });
        
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    },
  }),
  {
    name: 'auth-storage',
  }
)
);

export default useAuthStore;