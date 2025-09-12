import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import Agendamento from "@/pages/Agendamento";
import NotFound from "@/pages/NotFound";
import { Toaster } from "sonner";
import { useEffect } from "react";

const queryClient = new QueryClient();

function LoadingGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  // failsafe: se algo bugou, libera a UI após 3s
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById("__loading");
      if (el) el.style.display = "none";
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div id="__loading" className="min-h-screen flex items-center justify-center">
        <div className="text-bronze">Carregando…</div>
      </div>
    );
  }
  return <>{children}</>;
}

function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth?redirect=/admin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Admin />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <LoadingGate>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<AdminRoute />} />
                <Route path="/agendamento" element={<Agendamento />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LoadingGate>
          </BrowserRouter>
          <Toaster richColors position="top-center" />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
