import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Package, Ruler, Cherry, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  products: number;
  sizes: number;
  toppings: number;
  combos: number;
}

const Admin = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    sizes: 0,
    toppings: 0,
    combos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, sizesRes, toppingsRes, combosRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('sizes').select('id', { count: 'exact', head: true }),
        supabase.from('toppings').select('id', { count: 'exact', head: true }),
        supabase.from('combos').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: productsRes.count || 0,
        sizes: sizesRes.count || 0,
        toppings: toppingsRes.count || 0,
        combos: combosRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Produtos', value: stats.products, icon: Package, path: '/admin/products', color: 'bg-primary' },
    { label: 'Tamanhos', value: stats.sizes, icon: Ruler, path: '/admin/sizes', color: 'bg-blue-500' },
    { label: 'Adicionais', value: stats.toppings, icon: Cherry, path: '/admin/toppings', color: 'bg-orange-500' },
    { label: 'Combos', value: stats.combos, icon: Gift, path: '/admin/combos', color: 'bg-accent' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu cardápio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.path}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Package className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Gerenciar Produtos</span>
            </Link>
            <Link
              to="/admin/sizes"
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Ruler className="w-5 h-5 text-blue-500" />
              <span className="text-foreground font-medium">Gerenciar Tamanhos</span>
            </Link>
            <Link
              to="/admin/toppings"
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Cherry className="w-5 h-5 text-orange-500" />
              <span className="text-foreground font-medium">Gerenciar Adicionais</span>
            </Link>
            <Link
              to="/admin/combos"
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Gift className="w-5 h-5 text-accent" />
              <span className="text-foreground font-medium">Gerenciar Combos</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
