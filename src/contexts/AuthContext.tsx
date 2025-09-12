import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    try {
      const { data: sessRes } = await supabase.auth.getSession();
      const sess = sessRes.session ?? null;
      setSession(sess);
      setUser(sess?.user ?? null);

      if (sess?.user) {
        const { data: prof, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sess.user.id) // perfil pelo id = auth.user.id
          .maybeSingle();
        if (error) console.error("[profiles select]", error);
        setProfile(prof ?? null);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("[loadSession]", err);
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
    const { data } = supabase.auth.onAuthStateChange((_evt, _sess) => {
      loadSession();
    });
    const sub: any = (data as any)?.subscription ?? null;
    return () => {
      try {
        sub?.unsubscribe?.();
      } catch {}
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = /Email not confirmed/i.test(error.message)
        ? "E-mail não confirmado. Verifique sua caixa de entrada."
        : /Invalid/i.test(error.message)
        ? "Credenciais inválidas."
        : error.message;
      toast.error(msg);
    } else {
      toast.success("Login realizado!");
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName ?? "" } },
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    // garante profile (insert/update com tipagem tolerante)
    const uid = data.user?.id;
    if (uid) {
      const { data: existing, error: selErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", uid)
        .maybeSingle();
      if (selErr) console.error("[profiles exists]", selErr);

      if (existing) {
        const { error: updErr } = await supabase
          .from("profiles")
          .update({ full_name: fullName ?? "", email } as any)
          .eq("id", uid);
        if (updErr) console.error("[profiles update]", updErr);
      } else {
        const { error: insErr } = await supabase
          .from("profiles")
          .insert([{ id: uid, full_name: fullName ?? "", email }] as any);
        if (insErr) console.error("[profiles insert]", insErr);
      }
    }

    toast.success("Conta criada!");
    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Logout realizado!");
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
