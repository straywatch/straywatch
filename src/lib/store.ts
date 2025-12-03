import { create } from 'zustand';
import { supabase, getCurrentUser, isSupabaseConfigured } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  initialize: async () => {
    if (get().initialized) return;
    
    if (!isSupabaseConfigured) {
      set({ user: null, loading: false, initialized: true });
      return;
    }
    
    try {
      const user = await getCurrentUser();
      set({ user, loading: false, initialized: true });
      
      supabase.auth.onAuthStateChange((event, session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, loading: false, initialized: true });
    }
  },
}));

interface UIState {
  isAuthModalOpen: boolean;
  isReportFormOpen: boolean;
  selectedLocation: { lat: number; lng: number } | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openReportForm: (location?: { lat: number; lng: number }) => void;
  closeReportForm: () => void;
  setSelectedLocation: (location: { lat: number; lng: number } | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  isReportFormOpen: false,
  selectedLocation: null,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openReportForm: (location) => set({ isReportFormOpen: true, selectedLocation: location || null }),
  closeReportForm: () => set({ isReportFormOpen: false, selectedLocation: null }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
