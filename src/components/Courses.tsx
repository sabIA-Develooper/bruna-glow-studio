import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (course: any) => {
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      image_url: course.image_url,
      category: course.category
    });
  };

  const isInCart = (courseId: string) => items.some(item => item.id === courseId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'ebook':
        return <FileText className="w-4 h-4" />;
      case 'audiobook':
        return <Headphones className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vídeo Aulas';
      case 'ebook':
        return 'E-book PDF';
      case 'audiobook':
        return 'Áudiobook';
      default:
        return 'Curso';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
          
          {items.length > 0 && (
            <div className="inline-flex items-center space-x-2 bg-bronze text-primary-foreground rounded-full px-6 py-3 shadow-warm">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">{items.length} itens no carrinho</span>
              <Button 
                size="sm" 
                variant="secondary" 
                className="ml-2"
                onClick={() => navigate('/carrinho')}
              >
                Finalizar Compra
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-video bg-nude-light"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-nude-light rounded"></div>
                  <div className="h-3 bg-nude-light rounded w-3/4"></div>
                  <div className="h-8 bg-nude-light rounded"></div>
                </div>
              </Card>
            ))
          ) : (
            courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-warm transition-all duration-300 border-nude-light overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-nude to-nude-light relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bronze/30 to-transparent"></div>
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-1 bg-card rounded-full px-3 py-1">
                  {getTypeIcon(course.category)}
                  <span className="text-xs font-medium text-bronze">{getTypeLabel(course.category)}</span>
                </div>

                {/* Level Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-card/90 text-bronze">
                    {course.level || 'Básico'}
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
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration || '8h'}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-bronze rounded-full"></div>
                    <span className="text-xs text-bronze-light">Certificado incluso</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-bronze rounded-full"></div>
                    <span className="text-xs text-bronze-light">Acesso vitalício</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-bronze">{formatPrice(course.price)}</span>
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
                      onClick={() => handleAddToCart(course)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  )}
                  
                  {course.content_url && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-bronze hover:text-bronze-light"
                      onClick={() => window.open(course.content_url, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Acessar Curso
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
          )}
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