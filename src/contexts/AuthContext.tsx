import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { authApi, apiClient } from "@/lib/api-client";
import type { AuthUser, AuthSession, Profile } from "@/types/database";

type AuthContextType = {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: Profile | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    try {
      const token = apiClient.getToken();
      
      if (!token) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Verifica se o token ainda é válido
      const response = await authApi.me() as any;
      
      if (response) {
        setUser(response.user);
        setSession(response.session);
        setProfile(response.profile || null);
      } else {
        // Token inválido, limpa tudo
        apiClient.clearToken();
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (err) {
      console.error("[loadSession]", err);
      // Token inválido ou erro de rede, limpa tudo
      apiClient.clearToken();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
    
    // Verifica periodicamente se o token ainda é válido
    const interval = setInterval(() => {
      const token = apiClient.getToken();
      if (token && user) {
        // Verifica se o token expirou
        loadSession();
      }
    }, 5 * 60 * 1000); // Verifica a cada 5 minutos

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password) as any;
      
      // Armazena o token
      apiClient.setToken(response.session.token);
      
      // Atualiza o estado
      setUser(response.user);
      setSession(response.session);
      setProfile(response.profile || null);
      
      toast.success("Login realizado!");
      return { error: null };
    } catch (error: any) {
      const msg = /Email not confirmed/i.test(error.message)
        ? "E-mail não confirmado. Verifique sua caixa de entrada."
        : /Invalid/i.test(error.message)
        ? "Credenciais inválidas."
        : error.message || "Erro ao fazer login";
      toast.error(msg);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await authApi.register(email, password, fullName) as any;
      
      // Armazena o token se o registro incluir login automático
      if (response.session) {
        apiClient.setToken(response.session.token);
        setUser(response.user);
        setSession(response.session);
        setProfile(response.profile || null);
      }
      
      toast.success("Conta criada!");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
      
      // Limpa o estado local
      apiClient.clearToken();
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast.success("Logout realizado!");
    } catch (error: any) {
      // Mesmo com erro, limpa o estado local
      apiClient.clearToken();
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast.error(error.message || "Erro ao fazer logout");
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
