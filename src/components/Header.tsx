import { useState } from "react";
import { Menu, X, Calendar, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-warm-white/95 backdrop-blur-sm border-b border-nude-light sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-bronze to-bronze-light rounded-full flex items-center justify-center">
              <span className="text-cream font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-bronze">STUDIO BRUNA</h1>
              <p className="text-xs text-bronze-light">MAKEUP</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-bronze hover:text-bronze-light transition-colors">
              Início
            </a>
            <a href="#services" className="text-bronze hover:text-bronze-light transition-colors">
              Serviços
            </a>
            <a href="#courses" className="text-bronze hover:text-bronze-light transition-colors">
              Cursos
            </a>
            <a href="#about" className="text-bronze hover:text-bronze-light transition-colors">
              Sobre
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrinho
            </Button>
            <Button variant="ghost" size="sm" className="text-bronze hover:text-bronze-light">
              <User className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-bronze"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-nude-light">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-bronze hover:text-bronze-light transition-colors">
                Início
              </a>
              <a href="#services" className="text-bronze hover:text-bronze-light transition-colors">
                Serviços
              </a>
              <a href="#courses" className="text-bronze hover:text-bronze-light transition-colors">
                Cursos
              </a>
              <a href="#about" className="text-bronze hover:text-bronze-light transition-colors">
                Sobre
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-nude-light">
                <Button variant="outline" size="sm" className="border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-bronze to-bronze-light">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;