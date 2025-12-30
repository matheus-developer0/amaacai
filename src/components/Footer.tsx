import { MessageCircle, Clock, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = '5577981336827'; // Número de WhatsApp integrado com código do país (55)
  const whatsappMessage = encodeURIComponent('Olá, gostaria de fazer um pedido!');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-background">
                Açaí<span className="text-primary">ria</span>
              </span>
            </div>
            <p className="text-background/70 text-sm">
              O melhor açaí da cidade, feito com amor e ingredientes selecionados. Venha experimentar!
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>(77) 98133-6827</span>
              </a>
              <div className="flex items-center gap-3 text-background/70">
                <Clock className="w-5 h-5" />
                <span>Seg - Dom: 10h às 22h</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="w-5 h-5" />
                <span>Rua do Açaí, 123 - Centro</span>
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-background/20 pt-6">
          <p className="text-center text-background/50 text-sm">
            © 2026 Amaaçaí. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;