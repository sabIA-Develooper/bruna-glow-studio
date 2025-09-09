import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  FileText, 
  Headphones, 
  Star, 
  Clock, 
  Users, 
  ShoppingCart,
  Eye,
  BookOpen
} from "lucide-react";

const Courses = () => {
  const [cart, setCart] = useState<number[]>([]);

  const courses = [
    {
      id: 1,
      title: "Maquiagem Básica - Do Zero ao Profissional",
      description: "Aprenda técnicas fundamentais de maquiagem desde o básico até técnicas avançadas.",
      price: 197,
      originalPrice: 297,
      rating: 4.9,
      students: 1234,
      duration: "8h 30min",
      lessons: 24,
      type: "video",
      level: "Iniciante",
      image: "/course-basic.jpg",
      features: ["Certificado incluso", "Acesso vitalício", "Suporte direto", "Material complementar"]
    },
    {
      id: 2,
      title: "Técnicas Avançadas de Contouring",
      description: "Domine as técnicas mais avançadas de contorno e iluminação facial.",
      price: 147,
      originalPrice: 247,
      rating: 5.0,
      students: 856,
      duration: "5h 15min",
      lessons: 18,
      type: "video",
      level: "Avançado",
      image: "/course-contouring.jpg",
      features: ["Técnicas exclusivas", "Casos práticos", "Templates inclusos"]
    },
    {
      id: 3,
      title: "Maquiagem de Noivas - Guia Completo",
      description: "Especialização completa em maquiagem de noivas, do atendimento à execução.",
      price: 397,
      originalPrice: 597,
      rating: 4.8,
      students: 542,
      duration: "12h 45min",
      lessons: 35,
      type: "video",
      level: "Intermediário",
      image: "/course-bride.jpg",
      features: ["Precificação", "Atendimento ao cliente", "Portfólio profissional"]
    },
    {
      id: 4,
      title: "Skin Care Profissional - E-book",
      description: "Guia completo sobre cuidados com a pele e preparação para maquiagem.",
      price: 47,
      originalPrice: 97,
      rating: 4.7,
      students: 2341,
      duration: "2h leitura",
      lessons: 12,
      type: "pdf",
      level: "Básico",
      image: "/course-skincare.jpg",
      features: ["120 páginas", "Receitas naturais", "Checklist completo"]
    },
    {
      id: 5,
      title: "Podcast: Empreendedorismo na Beleza",
      description: "Série de áudios sobre como construir um negócio de sucesso na área da beleza.",
      price: 67,
      originalPrice: 127,
      rating: 4.6,
      students: 890,
      duration: "6h 20min",
      lessons: 15,
      type: "audio",
      level: "Todos os níveis",
      image: "/course-podcast.jpg",
      features: ["15 episódios", "Entrevistas exclusivas", "Planos de negócio"]
    },
    {
      id: 6,
      title: "Maquiagem Artística e Editorial",
      description: "Desenvolva criatividade e técnicas para maquiagens artísticas e editoriais.",
      price: 247,
      originalPrice: 397,
      rating: 4.9,
      students: 445,
      duration: "9h 10min",
      lessons: 28,
      type: "video",
      level: "Avançado",
      image: "/course-artistic.jpg",
      features: ["Projetos práticos", "Inspirações", "Tendências atuais"]
    }
  ];

  const addToCart = (courseId: number) => {
    setCart(prev => [...prev, courseId]);
  };

  const removeFromCart = (courseId: number) => {
    setCart(prev => prev.filter(id => id !== courseId));
  };

  const isInCart = (courseId: number) => cart.includes(courseId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vídeo Aulas';
      case 'pdf':
        return 'E-book PDF';
      case 'audio':
        return 'Áudiobook';
      default:
        return 'Curso';
    }
  };

  return (
    <section id="courses" className="py-20 bg-gradient-to-b from-warm-white to-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-bronze/10 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-bronze" />
            <span className="text-bronze text-sm font-medium">Academia de Beleza</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-bronze mb-4">
            Cursos Profissionais
          </h2>
          <p className="text-lg text-bronze-light max-w-2xl mx-auto mb-8">
            Aprenda com uma das melhores profissionais da área através de cursos 
            completos em vídeo, e-books e audiobooks.
          </p>
          
          {cart.length > 0 && (
            <div className="inline-flex items-center space-x-2 bg-bronze text-primary-foreground rounded-full px-6 py-3 shadow-warm">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">{cart.length} itens no carrinho</span>
              <Button size="sm" variant="secondary" className="ml-2">
                Finalizar Compra
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-warm transition-all duration-300 border-nude-light overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-nude to-nude-light relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bronze/30 to-transparent"></div>
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-1 bg-card rounded-full px-3 py-1">
                  {getTypeIcon(course.type)}
                  <span className="text-xs font-medium text-bronze">{getTypeLabel(course.type)}</span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-bronze text-primary-foreground rounded-full px-3 py-1">
                  <span className="text-xs font-bold">
                    -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                  </span>
                </div>

                {/* Level Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-card/90 text-bronze">
                    {course.level}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-bronze mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-bronze-light text-sm leading-relaxed line-clamp-2">{course.description}</p>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center justify-between text-sm text-bronze-light mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-bronze" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1 mb-6">
                  {course.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-bronze rounded-full"></div>
                      <span className="text-xs text-bronze-light">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-bronze">R$ {course.price}</span>
                  <span className="text-sm text-bronze-light line-through">R$ {course.originalPrice}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {isInCart(course.id) ? (
                    <Button 
                      variant="outline" 
                      className="w-full border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground"
                      onClick={() => removeFromCart(course.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Remover do Carrinho
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm group-hover:scale-105 transition-all duration-300"
                      onClick={() => addToCart(course.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-bronze hover:text-bronze-light"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Prévia
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-bronze-light mb-4">
            Oferecemos garantia de 30 dias em todos os nossos cursos
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-bronze-light">
              <div className="w-2 h-2 bg-bronze rounded-full"></div>
              <span>Certificado de conclusão</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-bronze-light">
              <div className="w-2 h-2 bg-bronze rounded-full"></div>
              <span>Suporte direto com a instrutora</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-bronze-light">
              <div className="w-2 h-2 bg-bronze rounded-full"></div>
              <span>Acesso vitalício</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;