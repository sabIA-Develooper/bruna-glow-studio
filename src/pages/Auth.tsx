import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);
  const redirect = params.get("redirect") || location.state?.redirect || "/";
  const serviceId = location.state?.serviceId;

  useEffect(() => {
    if (user) {
      if (redirect === '/agendamento' && serviceId) {
        navigate(redirect, { replace: true, state: { serviceId } });
      } else {
        navigate(redirect, { replace: true });
      }
    }
  }, [user, redirect, navigate, serviceId]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (!error) {
      if (redirect === '/agendamento' && serviceId) {
        navigate(redirect, { replace: true, state: { serviceId } });
      } else {
        navigate(redirect, { replace: true });
      }
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName"));
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const { error } = await signUp(email, password, fullName);
    setIsLoading(false);
    if (!error) {
      if (redirect === '/agendamento' && serviceId) {
        navigate(redirect, { replace: true, state: { serviceId } });
      } else {
        navigate(redirect, { replace: true });
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-bronze to-bronze-light rounded-full flex items-center justify-center">
              <span className="text-cream font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-bronze">STUDIO BRUNA</h1>
              <p className="text-sm text-bronze-light">MAKEUP</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="signin" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-white/80 backdrop-blur-sm border-nude-light">
              <CardHeader className="text-center">
                <CardTitle className="text-bronze">Entre em sua conta</CardTitle>
                <CardDescription>Acesse sua área pessoal</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4" autoComplete="on">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="border-nude-light focus:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" name="password" type="password" required className="border-nude-light focus:border-bronze" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-white/80 backdrop-blur-sm border-nude-light">
              <CardHeader className="text-center">
                <CardTitle className="text-bronze">Crie sua conta</CardTitle>
                <CardDescription>Cadastre-se para cursos e agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4" autoComplete="on">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input id="fullName" name="fullName" type="text" required className="border-nude-light focus:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="border-nude-light focus:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" name="password" type="password" minLength={6} required className="border-nude-light focus:border-bronze" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-bronze hover:text-bronze-light">
            ← Voltar ao site
          </Button>
        </div>
      </div>
    </div>
  );
}
