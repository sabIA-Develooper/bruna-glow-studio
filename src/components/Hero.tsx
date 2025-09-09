import { Button } from "@/components/ui/button";
import { Calendar, Play, Star } from "lucide-react";
import heroImage from "@/assets/hero-studio.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-warm-white to-cream">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-bronze-light">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm">Maquiadora Profissional</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-bronze leading-tight">
                STUDIO <br />
                <span className="bg-gradient-to-r from-bronze to-bronze-light bg-clip-text text-transparent">
                  BRUNA
                </span>
                <br />
                MAKEUP
              </h1>
              <p className="text-lg text-bronze-light max-w-lg leading-relaxed">
                Transforme sua beleza com serviços profissionais de maquiagem e 
                aprenda técnicas avançadas com nossos cursos exclusivos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Serviço
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Ver Cursos
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-nude-light">
              <div className="text-center">
                <div className="text-2xl font-bold text-bronze">500+</div>
                <div className="text-sm text-bronze-light">Clientes Atendidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bronze">50+</div>
                <div className="text-sm text-bronze-light">Cursos Disponíveis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bronze">5 Anos</div>
                <div className="text-sm text-bronze-light">de Experiência</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-warm">
              <img 
                src={heroImage} 
                alt="Studio Bruna Makeup" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bronze/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-2xl shadow-soft border border-nude-light">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-bronze">Agendamento Online</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-soft border border-nude-light">
              <div className="text-center">
                <div className="text-2xl font-bold text-bronze">4.9</div>
                <div className="flex justify-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current text-bronze-light" />
                  ))}
                </div>
                <div className="text-xs text-bronze-light mt-1">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;