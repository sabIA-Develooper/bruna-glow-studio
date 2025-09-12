import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Sparkles, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER = "5579998186347";
const DEFAULT_MSG = "Olá! Vim pelo site e gostaria de agendar um horário 🙂";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MSG)}`;

export default function Services() {
  const navigate = useNavigate();

  const services = [
    { id: 1, name: "Maquiagem Social", description: "Perfeita para eventos sociais e ocasiões especiais.", price: "R$ 120", duration: "90 min" },
    { id: 2, name: "Maquiagem de Noiva", description: "O grande dia pede uma maquiagem inesquecível.", price: "R$ 250", duration: "150 min" },
    { id: 3, name: "Skin Care Profissional", description: "Tratamento para pele radiante e saudável.", price: "R$ 80", duration: "60 min" },
    { id: 4, name: "Maquiagem Artística", description: "Criações únicas para ensaios e editoriais.", price: "R$ 180", duration: "120 min" },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-cream to-warm-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-nude/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-bronze" />
            <span className="text-bronze text-sm font-medium">Nossos Serviços</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-bronze mb-4">Transforme Sua Beleza</h2>
          <p className="text-lg text-bronze-light max-w-2xl mx-auto">
            Maquiagem profissional e skin care com técnicas avançadas e produtos premium.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((s) => (
            <Card key={s.id} className="group hover:shadow-warm transition-all duration-300 border-nude-light overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-nude-light to-nude relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-card px-3 py-1 rounded-full">
                  <span className="text-sm font-bold text-bronze">{s.price}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-bronze">{s.name}</h3>
                <p className="text-bronze-light text-sm mt-1">{s.description}</p>
                <div className="flex items-center gap-4 text-sm text-bronze-light my-4">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{s.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />No estúdio</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm flex-1"
                    onClick={() => navigate('/agendamento', { state: { serviceId: s.id } })}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Agora
                  </Button>

                  <Button
                    variant="outline"
                    className="border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground"
                    onClick={() => window.open(WHATSAPP_URL, "_blank")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
