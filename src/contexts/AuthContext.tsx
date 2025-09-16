import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { toast } from "sonner";

type AuthContextType = {
  user: any | null;
  session: any | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    try {
      // Check if we have a token in localStorage
      const token = localStorage.getItem('supabase_token');
      if (!token) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Try to get user info from API
      const data = await apiService.getMe();
      setUser(data.user);
      setSession({ access_token: token });
      setProfile(data.profile);
    } catch (err) {
      console.error("[loadSession]", err);
      // Clear invalid token
      localStorage.removeItem('supabase_token');
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiService.signIn(email, password);
      setUser(data.user);
      setSession(data.session);
      setProfile(data.profile);
      toast.success("Login realizado!");
      return { error: null };
    } catch (error: any) {
      const msg = /Email not confirmed/i.test(error.message)
        ? "E-mail não confirmado. Verifique sua caixa de entrada."
        : /Invalid/i.test(error.message)
        ? "Credenciais inválidas."
        : error.message;
      toast.error(msg);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const data = await apiService.signUp(email, password, fullName);
      setUser(data.user);
      setSession(data.session);
      // Profile will be created by the API
      toast.success("Conta criada!");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await apiService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success("Logout realizado!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isAdmin = !!profile?.is_admin;

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
