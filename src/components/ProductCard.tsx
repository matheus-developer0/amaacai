import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  onSelect: (id: number) => void;
  badge?: string;
}

const ProductCard = ({ id, name, description, price, image, onSelect, badge }: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden hover-lift transition-all duration-300" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-acai-purple-light to-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-4xl">🍇</span>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">A partir de</span>
            <p className="text-xl font-bold text-primary">{price}</p>
          </div>
          <Button
            onClick={() => onSelect(id)}
            size="sm"
            className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-1"
          >
            <Plus className="w-4 h-4" />
            Montar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
