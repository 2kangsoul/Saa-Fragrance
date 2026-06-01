import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import backendlessApi from '../config/api';

interface UserData {
  name?: string;
  email?: string;
  objectId: string; 
  userToken: string; 
  role?: string; 
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  setAuth: (userData: UserData) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      setAuth: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),

      fetchCurrentUser: async () => {
        const currentUser = get().user;
        
        if (!currentUser?.userToken || !currentUser?.objectId) return;

        try {
          console.groupCollapsed(`🔐 [AuthStore] Sesi Aktif: ${currentUser.name || 'User'}`);
          console.log(`🚀 Menembak API ID: ${currentUser.objectId}`);
          console.log(`🔑 Token: ${currentUser.userToken}`);
          
          const response = await backendlessApi.get(`data/Users/${currentUser.objectId}`);
          
          console.log("✅ Data dari DB:", response.data);
          
          set({
            user: {
              ...currentUser,
              name: response.data.name || currentUser.name,
              email: response.data.email,
              objectId: response.data.objectId,
              role: response.data.role || 'user',
            }
          });

          console.log(`💾 State di RAM tersimpan: ${response.data.name}`);
          console.groupEnd();

        } catch (error: any) {
          console.error("❌ [AuthStore] Gagal mengambil data:", error);
          
          if (error.response?.status === 401 || error.response?.status === 400) {
            get().logout();
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          userToken: state.user.userToken,
          objectId: state.user.objectId, 
          role: state.user.role,
          name: state.user.name, // <-- TAMBAHAN: Menyimpan name ke storage
        } : null,
      }),
    }
  )
);