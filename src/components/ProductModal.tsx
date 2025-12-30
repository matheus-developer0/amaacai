import { X, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // Keeping as string for now, will parse for calculation
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type Size = Tables<'sizes'>;
type Topping = Tables<'toppings'>;

const whatsappNumber = '5577981336827'; // Número de WhatsApp da loja

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);

  // Fetch sizes from Supabase
  const { data: fetchedSizes, isLoading: isLoadingSizes, error: sizesError } = useQuery<Size[]>({
    queryKey: ['sizes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sizes').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data;
    },
  });

  // Fetch toppings from Supabase
  const { data: fetchedToppings, isLoading: isLoadingToppings, error: toppingsError } = useQuery<Topping[]>({
    queryKey: ['toppings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('toppings').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (fetchedSizes && fetchedSizes.length > 0 && !selectedSizeId) {
      setSelectedSizeId(fetchedSizes[0].id); // Set first size as default
    }
  }, [fetchedSizes, selectedSizeId]);

  useEffect(() => {
    if (sizesError) {
      toast.error('Erro ao carregar tamanhos: ' + sizesError.message);
    }
    if (toppingsError) {
      toast.error('Erro ao carregar adicionais: ' + toppingsError.message);
    }
  }, [sizesError, toppingsError]);

  const toggleAdditional = (id: string) => {
    setSelectedAdditionals(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleFinishOrder = () => {
    if (!product || !selectedSizeId || !fetchedSizes || !fetchedToppings) {
      toast.error('Por favor, selecione um tamanho para o açaí.');
      return;
    }

    const basePrice = parseFloat(product.price.replace('R$', '').replace(',', '.').trim());
    const selectedSize = fetchedSizes.find(s => s.id === selectedSizeId);

    if (!selectedSize) {
      toast.error('Tamanho selecionado inválido.');
      return;
    }

    let totalPrice = selectedSize.price;
    let message = `Olá, gostaria de fazer um pedido:\n\n`;
    message += `*Produto:* ${product.name}\n`;
    message += `*Tamanho:* ${selectedSize.name} (R$ ${selectedSize.price.toFixed(2).replace('.', ',')})\n`;

    if (selectedAdditionals.length > 0) {
      message += `*Adicionais:*\n`;
      selectedAdditionals.forEach(additionalId => {
        const topping = fetchedToppings.find(t => t.id === additionalId);
        if (topping) {
          totalPrice += topping.price;
          message += `- ${topping.name} (+ R$ ${topping.price.toFixed(2).replace('.', ',')})\n`;
        }
      });
    } else {
      message += `*Adicionais:* Nenhum\n`;
    }

    message += `\n*Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}\n`;
    message += `\nObrigado!`;

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    onClose();
    toast.success('Pedido enviado para o WhatsApp!');
  };

  if (!isOpen || !product) return null;

  const currentSizes = fetchedSizes || [];
  const currentToppings = fetchedToppings || [];

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
            {isLoadingSizes ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {currentSizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSizeId(size.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedSizeId === size.id
                        ? 'border-primary bg-acai-purple-light'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold text-foreground">{size.name}</p>
                    <p className="text-sm text-primary">R$ {size.price.toFixed(2).replace('.', ',')}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Additionals */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Adicionais</h3>
            {isLoadingToppings ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {currentToppings.map(additional => (
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
                    <span className="text-xs text-accent font-semibold">+ R$ {additional.price.toFixed(2).replace('.', ',')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Order Button */}
          <Button
            onClick={handleFinishOrder}
            className="w-full btn-glow bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 rounded-full"
            disabled={isLoadingSizes || isLoadingToppings || !selectedSizeId}
          >
            {isLoadingSizes || isLoadingToppings ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Finalizar Pedido'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;