import { Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

const combos = [
  {
    id: 1,
    name: 'Combo Família',
    description: '2 açaís 700ml + 2 açaís 500ml com 4 adicionais cada. Perfeito para compartilhar!',
    originalPrice: 'R$ 84,00',
    price: 'R$ 69,90',
    badge: 'Mais Pedido',
    icon: Star,
  },
  {
    id: 2,
    name: 'Combo Casal',
    description: '2 açaís 500ml com 3 adicionais cada + 2 garrafas de água.',
    originalPrice: 'R$ 42,00',
    price: 'R$ 34,90',
    badge: 'Promoção',
    icon: Flame,
  },
  {
    id: 3,
    name: 'Combo Fitness',
    description: 'Açaí 500ml + whey protein + banana + granola + pasta de amendoim.',
    originalPrice: 'R$ 32,00',
    price: 'R$ 26,90',
    badge: 'Novidade',
    icon: Star,
  },
];

const Combos = () => {
  return (
    <section id="combos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-acai-green-light text-accent text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Combos Especiais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Combos <span className="text-accent">Imperdíveis</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Economize com nossos combos especiais. Mais açaí, mais sabor, mais economia!
          </p>
        </div>
        
        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo, index) => {
            const IconComponent = combo.icon;
            return (
              <div
                key={combo.id}
                className="animate-fade-in-up group relative bg-card rounded-2xl overflow-hidden hover-lift transition-all duration-300 border-2 border-accent/20 hover:border-accent"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  <IconComponent className="w-3 h-3" />
                  {combo.badge}
                </div>
                
                {/* Image/Icon Area */}
                <div className="h-40 bg-gradient-to-br from-accent/20 to-acai-green-light flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl">🍨</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                    {combo.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {combo.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-muted-foreground line-through text-sm">
                      {combo.originalPrice}
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      {combo.price}
                    </span>
                  </div>
                  
                  {/* Button */}
                  <Button
                    className="w-full btn-glow bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
                  >
                    Pedir Combo
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Combos;
