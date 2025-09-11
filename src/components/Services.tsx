import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = (serviceId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/agendamento', { state: { serviceId } });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-cream to-warm-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-nude/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-bronze" />
            <span className="text-bronze text-sm font-medium">Nossos Serviços</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-bronze mb-4">
            Transforme Sua Beleza
          </h2>
          <p className="text-lg text-bronze-light max-w-2xl mx-auto">
            Oferecemos serviços profissionais de maquiagem e skin care com técnicas 
            avançadas e produtos de alta qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-video bg-nude-light"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-nude-light rounded"></div>
                  <div className="h-3 bg-nude-light rounded w-3/4"></div>
                </div>
              </Card>
            ))
          ) : (
            services.map((service) => (
            <Card key={service.id} className="group hover:shadow-warm transition-all duration-300 border-nude-light overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-nude-light to-nude relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bronze/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-card px-3 py-1 rounded-full">
                  <span className="text-sm font-bold text-bronze">{formatPrice(service.price)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-bronze mb-2">{service.name}</h3>
                    <p className="text-bronze-light text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-bronze-light mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>No estúdio</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-bronze rounded-full"></div>
                    <span className="text-sm text-bronze-light">{service.description}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm group-hover:scale-105 transition-all duration-300"
                  onClick={() => handleSchedule(service.id)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Agora
                </Button>
              </div>
            </Card>
          ))
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-bronze-light mb-4">
            Não encontrou o que procura? Entre em contato conosco!
          </p>
          <Button variant="outline" className="border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground">
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;