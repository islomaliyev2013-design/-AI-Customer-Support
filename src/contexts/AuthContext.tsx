import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Business } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getCurrentBusiness, saveBusiness } from '../services/db';

interface AuthContextType {
  user: UserProfile | null;
  business: Business | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: string }>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ error?: string; requireVerification?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  updateBusinessData: (updates: Partial<Business>) => Promise<void>;
  refreshBusiness: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial fallback mock profile for instant out-of-the-box demo
const DEMO_PROFILE: UserProfile = {
  id: 'user-001',
  email: 'alex.mercer@apextech.io',
  full_name: 'Alex Mercer',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  created_at: new Date('2026-01-01').toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_PROFILE;
      }
    }
    return DEMO_PROFILE;
  });

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load business on mount or user change
  const loadBusiness = async (userId?: string) => {
    try {
      const biz = await getCurrentBusiness(userId);
      setBusiness(biz);
    } catch (err) {
      console.error('Failed to load business:', err);
    }
  };

  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'Admin User',
              avatar_url: session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
            };
            setUser(profile);
            localStorage.setItem('nexus_user', JSON.stringify(profile));
            await loadBusiness(session.user.id);
          } else {
            // Check local fallback
            const saved = localStorage.getItem('nexus_user');
            if (saved) {
              const parsed = JSON.parse(saved);
              setUser(parsed);
              await loadBusiness(parsed.id);
            } else {
              setUser(DEMO_PROFILE);
              await loadBusiness(DEMO_PROFILE.id);
            }
          }
        } catch {
          await loadBusiness(user?.id);
        }
      } else {
        await loadBusiness(user?.id);
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            created_at: data.user.created_at,
          };
          setUser(profile);
          if (rememberMe) {
            localStorage.setItem('nexus_user', JSON.stringify(profile));
          }
          await loadBusiness(profile.id);
        }
        setLoading(false);
        return {};
      } catch (err: any) {
        setLoading(false);
        return { error: err.message || 'Login failed.' };
      }
    }

    // Local / Demo Authentication simulation
    await new Promise((res) => setTimeout(res, 600)); // Smooth realistic latency
    const profile: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      full_name: email.split('@')[0].replace(/[._]/g, ' '),
      created_at: new Date().toISOString(),
    };
    setUser(profile);
    if (rememberMe) {
      localStorage.setItem('nexus_user', JSON.stringify(profile));
    }
    await loadBusiness(profile.id);
    setLoading(false);
    return {};
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) {
          setLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            created_at: data.user.created_at,
          };
          setUser(profile);
          localStorage.setItem('nexus_user', JSON.stringify(profile));

          // Create initial profile in profiles table
          try {
            await supabase.from('profiles').upsert(profile);
          } catch {
            // Ignore if RLS/setup pending
          }

          setLoading(false);
          return { requireVerification: !data.session };
        }
      } catch (err: any) {
        setLoading(false);
        return { error: err.message || 'Sign up failed.' };
      }
    }

    // Local / Demo mode sign up
    await new Promise((res) => setTimeout(res, 600));
    const newProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    };
    setUser(newProfile);
    localStorage.setItem('nexus_user', JSON.stringify(newProfile));
    setLoading(false);
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Continue
      }
    }
    localStorage.removeItem('nexus_user');
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { error: error.message };
        return { success: true };
      } catch (err: any) {
        return { error: err.message };
      }
    }

    await new Promise((res) => setTimeout(res, 500));
    return { success: true };
  };

  const updateBusinessData = async (updates: Partial<Business>) => {
    const updated = await saveBusiness(updates);
    setBusiness(updated);
  };

  const refreshBusiness = async () => {
    await loadBusiness(user?.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateBusinessData,
        refreshBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
