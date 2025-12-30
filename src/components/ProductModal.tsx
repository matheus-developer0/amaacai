import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const sizes = [
  { id: 1, name: '300ml', price: 'R$ 12,00' },
  { id: 2, name: '500ml', price: 'R$ 18,00' },
  { id: 3, name: '700ml', price: 'R$ 24,00' },
];

const additionals = [
  { id: 1, name: 'Granola', price: '+ R$ 2,00' },
  { id: 2, name: 'Leite em Pó', price: '+ R$ 2,00' },
  { id: 3, name: 'Leite Condensado', price: '+ R$ 3,00' },
  { id: 4, name: 'Paçoca', price: '+ R$ 2,00' },
  { id: 5, name: 'Banana', price: '+ R$ 2,50' },
  { id: 6, name: 'Morango', price: '+ R$ 3,00' },
  { id: 7, name: 'Nutella', price: '+ R$ 5,00' },
  { id: 8, name: 'Mel', price: '+ R$ 2,00' },
];

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState<number>(2);
  const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([]);

  const toggleAdditional = (id: number) => {
    setSelectedAdditionals(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        
        {/* Product Image */}
        <div className="h-48 bg-gradient-to-br from-primary to-acai-purple-dark flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-primary-foreground/20 flex items-center justify-center animate-float">
            <span className="text-6xl">🍇</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {/* Product Info */}
          <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Escolha o tamanho</h3>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedSize === size.id
                      ? 'border-primary bg-acai-purple-light'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-bold text-foreground">{size.name}</p>
                  <p className="text-sm text-primary">{size.price}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Additionals */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Adicionais</h3>
            <div className="grid grid-cols-2 gap-2">
              {additionals.map(additional => (
                <button
                  key={additional.id}
                  onClick={() => toggleAdditional(additional.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    selectedAdditionals.includes(additional.id)
                      ? 'border-accent bg-acai-green-light'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{additional.name}</span>
                  <span className="text-xs text-accent font-semibold">{additional.price}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Order Button */}
          <Button
            className="w-full btn-glow bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 rounded-full"
          >
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
