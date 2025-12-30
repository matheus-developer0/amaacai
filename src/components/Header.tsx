import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuMenuOpen(false);
    }
  };

  const whatsappNumber = '77981336827'; // Número de WhatsApp integrado
  const whatsappMessage = encodeURIComponent('Olá, gostaria de fazer um pedido!');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg md:text-xl">A</span>
            </div>
            <span className="font-bold text-xl md:text-2xl text-foreground">
              Açaí<span className="text-primary">ria</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('cardapio')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Cardápio
            </button>
            <button
              onClick={() => scrollToSection('combos')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Combos
            </button>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                className="btn-glow bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Pedir no WhatsApp
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuMenuOpen(!isMobileMenuMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('cardapio')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium text-left py-2"
            >
              Cardápio
            </button>
            <button
              onClick={() => scrollToSection('combos')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium text-left py-2"
            >
              Combos
            </button>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                className="btn-glow bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full"
              >
                <MessageCircle className="w-4 h-4" />
                Pedir no WhatsApp
              </Button>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;