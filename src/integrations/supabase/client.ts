import { createClient } from "@supabase/supabase-js";

/** Lê envs nos dois formatos (ANON ou PUBLISHABLE) e também aceita PROJECT_ID. */
const projectId = (import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined) || undefined;

const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (projectId ? `https://${projectId}.supabase.co` : undefined);

const anon =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  undefined;

export const SUPABASE_READY = !!(url && anon);

// Diagnóstico (remova depois se quiser)
console.table({
  VITE_SUPABASE_URL: url ?? "(vazio)",
  VITE_SUPABASE_PROJECT_ID: projectId ?? "(vazio)",
  HAS_ANON_OR_PUBLISHABLE: !!anon,
  SUPABASE_READY,
});

if (!SUPABASE_READY) {
  console.warn(
    "[Supabase] Variáveis ausentes. Configure VITE_SUPABASE_URL (ou PROJECT_ID) e VITE_SUPABASE_ANON_KEY/PUBLISHABLE_KEY."
  );
}

export const supabase = createClient(
  url || "https://example.supabase.co",
  anon || "public-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  }
);
