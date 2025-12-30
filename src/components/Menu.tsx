import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const products = [
  {
    id: 1,
    name: 'Açaí Tradicional',
    description: 'Açaí puro e cremoso, batido na hora. O sabor original da Amazônia.',
    price: 'R$ 12,00',
    image: '',
    badge: 'Mais Pedido',
  },
  {
    id: 2,
    name: 'Açaí com Banana',
    description: 'Açaí cremoso batido com banana fresca. Combinação perfeita!',
    price: 'R$ 14,00',
    image: '',
  },
  {
    id: 3,
    name: 'Açaí com Morango',
    description: 'Açaí batido com morangos frescos. Sabor irresistível!',
    price: 'R$ 15,00',
    image: '',
  },
  {
    id: 4,
    name: 'Açaí Tropical',
    description: 'Mix de açaí com frutas tropicais. Refrescante e nutritivo.',
    price: 'R$ 16,00',
    image: '',
    badge: 'Novidade',
  },
  {
    id: 5,
    name: 'Açaí Power',
    description: 'Açaí turbinado com whey protein e pasta de amendoim.',
    price: 'R$ 18,00',
    image: '',
  },
  {
    id: 6,
    name: 'Açaí Zero',
    description: 'Açaí sem adição de açúcar. Ideal para dietas low carb.',
    price: 'R$ 14,00',
    image: '',
  },
];

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <section id="cardapio" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-acai-purple-light text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Cardápio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Monte Seu <span className="text-primary">Açaí</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Escolha seu sabor favorito e personalize com os adicionais que você mais ama.
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                {...product}
                onSelect={handleSelectProduct}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Menu;
