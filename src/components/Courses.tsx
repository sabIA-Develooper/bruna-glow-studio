import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Star, Users, Clock, BookOpen, Award } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: string;
  features: string[];
  preview?: string;
}

const Courses = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await apiService.getCourses();
      const mappedCourses = data.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        price: parseFloat(course.price),
        rating: 4.8,
        students: 1234,
        duration: course.duration || '2h 30min',
        lessons: 15,
        level: course.level || 'Básico',
        features: [
          'Acesso vitalício',
          'Certificado de conclusão',
          'Suporte via WhatsApp',
          'Material didático PDF'
        ],
        preview: course.content_url
      }));
      setCourses(mappedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const preview = (course: Course) => {
    setCurrent(course);
    setOpen(true);
  };

  const enroll = (course?: Course) => {
    const courseToAdd = course || current;
    if (courseToAdd) {
      addToCart(courseToAdd);
      setOpen(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-warm-white via-nude-light to-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-bronze mb-4">Carregando cursos...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cursos" className="py-20 bg-gradient-to-br from-warm-white via-nude-light to-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-bronze mb-4">
            Cursos de Harmonização Facial
          </h2>
          <p className="text-xl text-bronze-light max-w-2xl mx-auto">
            Domine técnicas profissionais com conteúdo direto ao ponto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? courses.map((course) => (
            <Card key={course.id} className="group border-nude-light overflow-hidden hover:shadow-warm transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-nude to-nude-light relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-card rounded-full px-3 py-1 border border-nude-light">
                  <span className="text-sm font-semibold text-bronze">R$ {course.price}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-16 h-16 rounded-full bg-white/80 hover:bg-white border-2 border-bronze shadow-lg transition-all group-hover:scale-110"
                    onClick={() => preview(course)}
                  >
                    <Play className="w-6 h-6 text-bronze fill-bronze" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-bronze text-bronze">
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-bronze-light">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{course.rating}</span>
                    <span>({course.students})</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-bronze mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-bronze-light mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-bronze-light mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} aulas</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-bronze text-bronze hover:bg-bronze hover:text-cream"
                    onClick={() => preview(course)}
                  >
                    Ver Preview
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-bronze to-bronze-light hover:from-bronze-light hover:to-bronze text-cream"
                    onClick={() => enroll(course)}
                  >
                    Inscrever-se
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-8">
              <p className="text-bronze-light">Nenhum curso disponível no momento.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-bronze">{current?.title}</DialogTitle>
          </DialogHeader>
          
          {current && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-video bg-gradient-to-br from-nude to-nude-light rounded-lg flex items-center justify-center">
                {current.preview ? (
                  <iframe
                    src={current.preview}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center text-bronze-light">
                    <Play className="w-16 h-16 mx-auto mb-2" />
                    <p>Preview indisponível</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-bronze-light">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{current.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{current.lessons} aulas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{current.students} alunos</span>
                  </div>
                </div>
                
                <p className="text-bronze-light">{current.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-bronze flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    O que você vai aprender:
                  </h4>
                  <ul className="space-y-1">
                    {current.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-bronze-light">
                        <div className="w-1.5 h-1.5 bg-bronze rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="text-3xl font-bold text-bronze">
                    R$ {current.price}
                  </div>
                  <Badge variant="outline" className="border-bronze text-bronze">
                    {current.level}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button 
                    onClick={() => enroll()}
                    className="flex-1 bg-gradient-to-r from-bronze to-bronze-light hover:from-bronze-light hover:to-bronze text-cream"
                  >
                    Inscrever-se
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Courses;