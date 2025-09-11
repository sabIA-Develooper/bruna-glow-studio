import { Card } from "@/components/ui/card";
import { Award, Heart, Sparkles, Users } from "lucide-react";

const About = () => {
  const achievements = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "500+",
      label: "Clientes Satisfeitas",
      description: "Clientes atendidas com excelência"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "8",
      label: "Anos de Experiência", 
      description: "Aperfeiçoando técnicas constantemente"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      number: "50+",
      label: "Cursos Disponíveis",
      description: "Conhecimento compartilhado"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      number: "4.9",
      label: "Avaliação Média",
      description: "Baseado em avaliações reais"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-cream to-warm-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-bronze/10 rounded-full px-4 py-2 mb-4">
                <Heart className="w-4 h-4 text-bronze" />
                <span className="text-bronze text-sm font-medium">Sobre Mim</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-bronze mb-6">
                Olá, eu sou a Bruna!
              </h2>
              <div className="space-y-4 text-bronze-light leading-relaxed">
                <p>
                  Há mais de 8 anos, me dedico à arte da maquiagem e ao cuidado com a beleza. 
                  Minha paixão é realçar a beleza natural de cada pessoa, criando looks únicos 
                  e inesquecíveis.
                </p>
                <p>
                  Além dos atendimentos no estúdio, compartilho meu conhecimento através de 
                  cursos completos, ajudando outras pessoas a descobrirem o mundo da maquiagem 
                  profissional.
                </p>
                <p>
                  Cada cliente é especial para mim, e trabalho para garantir que se sintam 
                  confiantes e radiantes. Seja para um evento especial ou para aprender novas 
                  técnicas, estou aqui para transformar sua experiência com a beleza.
                </p>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-bronze">Certificações</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-bronze rounded-full"></div>
                  <span className="text-bronze-light">Curso Profissional de Maquiagem - SENAC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-bronze rounded-full"></div>
                  <span className="text-bronze-light">Especialização em Maquiagem de Noivas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-bronze rounded-full"></div>
                  <span className="text-bronze-light">Curso de Visagismo e Colorimetria</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-bronze rounded-full"></div>
                  <span className="text-bronze-light">Workshop de Maquiagem Artística</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-warm transition-all duration-300 border-nude-light">
                <div className="flex justify-center mb-4 text-bronze">
                  {achievement.icon}
                </div>
                <div className="text-3xl font-bold text-bronze mb-2">
                  {achievement.number}
                </div>
                <div className="font-medium text-bronze mb-1">
                  {achievement.label}
                </div>
                <div className="text-sm text-bronze-light">
                  {achievement.description}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;