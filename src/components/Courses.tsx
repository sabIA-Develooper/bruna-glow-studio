import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  BookOpen,
} from "lucide-react";

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: "Iniciante" | "Intermediário" | "Avançado";
  image?: string;
  features: string[];
  preview?: {
    type: "video" | "texto";
    url?: string;       // YouTube/Vimeo embed URL
    sampleText?: string;
  };
};

// ID do vídeo: Xxl15httm5s
const YT_EMBED = "https://www.youtube.com/embed/Xxl15httm5s?rel=0&modestbranding=1";

const COURSES: Course[] = [
  {
    id: 1,
    title: "Pele Perfeita: do Skin Prep ao Glow",
    description:
      "Domine a preparação de pele e acabamento profissional para qualquer ocasião.",
    price: 97,
    originalPrice: 197,
    rating: 4.9,
    students: 1240,
    duration: "3h 40min",
    lessons: 16,
    level: "Intermediário",
    image: "/course-skin.jpg",
    features: ["Skin prep completo", "Texturas e camadas", "Fixação e glow"],
    preview: { type: "video", url: YT_EMBED },
  },
  {
    id: 2,
    title: "Contorno & Iluminação 360°",
    description:
      "Técnicas atualizadas de contorno e iluminação para diferentes formatos de rosto.",
    price: 147,
    originalPrice: 247,
    rating: 5.0,
    students: 856,
    duration: "5h 15min",
    lessons: 18,
    level: "Avançado",
    image: "/course-contouring.jpg",
    features: ["Mapeamento facial", "Produtos cremosos x pó", "Blend perfeito"],
    preview: { type: "video", url: YT_EMBED },
  },
  {
    id: 3,
    title: "Noivas: Guia Completo",
    description:
      "Processo do briefing ao grande dia, com testes, durabilidade e fotografia.",
    price: 197,
    originalPrice: 297,
    rating: 4.8,
    students: 640,
    duration: "6h 10min",
    lessons: 22,
    level: "Avançado",
    image: "/course-bride.jpg",
    features: ["Teste de maquiagem", "Kit pro dia D", "Checklist fotográfico"],
    preview: { type: "video", url: YT_EMBED },
  },
];

function PreviewModal({
  open,
  onClose,
  course,
  onEnroll,
}: {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  onEnroll: () => void;
}) {
  if (!open || !course) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-card text-card-foreground border border-nude-light shadow-xl overflow-hidden">
        <div className="p-6 border-b border-nude-light">
          <h3 className="text-2xl font-bold text-bronze">{course.title}</h3>
          <p className="text-sm text-bronze-light mt-1">{course.description}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Player */}
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-nude-light">
            {course.preview?.type === "video" && course.preview.url ? (
              <iframe
                src={course.preview.url}
                title={`Prévia — ${course.title}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-nude to-nude-light flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <Play className="w-10 h-10 mb-2" />
                  <span className="text-sm text-bronze-light">Prévia indisponível</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons} aulas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()} alunas</span>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-2 mt-2">
            {course.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-bronze">
                <div className="w-2 h-2 rounded-full bg-bronze" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-nude-light flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-bronze">R$ {course.price}</span>
            {course.originalPrice && (
              <span className="text-sm line-through text-bronze-light">
                R$ {course.originalPrice}
              </span>
            )}
            <Badge className="bg-nude text-bronze border border-nude-light">
              {course.level}
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="border-bronze" onClick={onClose}>
              Fechar
            </Button>
            <Button
              className="bg-gradient-to-r from-bronze to-bronze-light"
              onClick={onEnroll}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Matricular-se (teste)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Courses = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Course | null>(null);

  const handlePreview = (course: Course) => {
    setCurrent(course);
    setOpen(true);
  };

  const handleEnroll = () => {
    setOpen(false);
    navigate("/auth");
  };

  return (
    <section id="courses" className="py-20 bg-gradient-to-b from-warm-white to-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-nude/30 rounded-full px-4 py-2 mb-4">
            <FileText className="w-4 h-4 text-bronze" />
            <span className="text-sm text-bronze font-medium">Cursos</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-bronze mb-3">
            Aprenda com a Bruna
          </h2>
          <p className="text-lg text-bronze-light max-w-2xl mx-auto">
            Domine técnicas profissionais com conteúdo direto ao ponto e foco em
            resultado real nas clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <Card
              key={course.id}
              className="group border-nude-light overflow-hidden hover:shadow-warm transition-all duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-nude to-nude-light relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-card rounded-full px-3 py-1 border border-nude-light">
                  <span className="text-sm font-semibold text-bronze">
                    R$ {course.price}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-bronze">{course.title}</h3>
                    <p className="text-sm text-bronze-light mt-1">
                      {course.description}
                    </p>
                  </div>
                  <Badge className="bg-nude text-bronze border border-nude-light">
                    {course.level}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-bronze-light">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} aulas</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {course.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-bronze">
                      <div className="w-2 h-2 rounded-full bg-bronze" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground"
                    onClick={() => handlePreview(course)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Prévia
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-bronze to-bronze-light flex-1"
                    onClick={handleEnroll}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Matricular-se
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <PreviewModal
        open={open}
        onClose={() => setOpen(false)}
        course={current}
        onEnroll={handleEnroll}
      />
    </section>
  );
};

export default Courses;
