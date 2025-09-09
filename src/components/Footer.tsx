import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-bronze text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cream to-nude rounded-full flex items-center justify-center">
                <span className="text-bronze font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">STUDIO BRUNA</h3>
                <p className="text-xs opacity-80">MAKEUP</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Transformando a beleza através de técnicas profissionais e 
              ensinamentos de qualidade há mais de 5 anos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Serviços</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Maquiagem Social</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Maquiagem de Noiva</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Skin Care</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Maquiagem Artística</a></li>
            </ul>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Cursos</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Maquiagem Básica</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Técnicas Avançadas</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Maquiagem de Noivas</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Empreendedorismo</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contato</h4>
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contato@studiobruna.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>São Paulo, SP<br />Centro da cidade</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 mt-0.5" />
                <span>Seg - Sex: 9h às 18h<br />Sáb: 9h às 15h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-bronze-light/20 mt-12 pt-8 text-center">
          <p className="text-sm opacity-80">
            © 2024 Studio Bruna Makeup. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;