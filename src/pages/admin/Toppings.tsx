import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

interface Topping {
  id: string;
  name: string;
  price: number;
  category: string | null;
  display_order: number;
  is_active: boolean;
}

const Toppings = () => {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    is_active: true,
    display_order: 0,
  });

  const fetchToppings = async () => {
    const { data, error } = await supabase
      .from('toppings')
      .select('*')
      .order('display_order');
    
    if (error) {
      toast.error('Erro ao carregar adicionais');
    } else {
      setToppings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchToppings();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      is_active: true,
      display_order: toppings.length,
    });
    setEditingTopping(null);
    setShowForm(false);
  };

  const handleEdit = (topping: Topping) => {
    setEditingTopping(topping);
    setFormData({
      name: topping.name,
      price: topping.price.toString(),
      category: topping.category || '',
      is_active: topping.is_active,
      display_order: topping.display_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const toppingData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    if (editingTopping) {
      const { error } = await supabase
        .from('toppings')
        .update(toppingData)
        .eq('id', editingTopping.id);

      if (error) {
        toast.error('Erro ao atualizar adicional');
      } else {
        toast.success('Adicional atualizado!');
        resetForm();
        fetchToppings();
      }
    } else {
      const { error } = await supabase
        .from('toppings')
        .insert([toppingData]);

      if (error) {
        toast.error('Erro ao criar adicional');
      } else {
        toast.success('Adicional criado!');
        resetForm();
        fetchToppings();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este adicional?')) return;

    const { error } = await supabase.from('toppings').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir adicional');
    } else {
      toast.success('Adicional excluído!');
      fetchToppings();
    }
  };

  const toggleActive = async (topping: Topping) => {
    const { error } = await supabase
      .from('toppings')
      .update({ is_active: !topping.is_active })
      .eq('id', topping.id);

    if (error) {
      toast.error('Erro ao atualizar adicional');
    } else {
      fetchToppings();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Adicionais</h1>
            <p className="text-muted-foreground mt-1">Gerencie os toppings e complementos</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Adicional
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/50" onClick={resetForm} />
            <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingTopping ? 'Editar Adicional' : 'Novo Adicional'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Granola, Leite Condensado"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria (opcional)</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Frutas, Caldas, Cereais"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Ordem de exibição</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Ativo</Label>
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1 bg-primary">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toppings List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </div>
          ) : toppings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum adicional cadastrado
            </div>
          ) : (
            <div className="divide-y divide-border">
              {toppings.map((topping) => (
                <div key={topping.id} className="p-4 flex items-center justify-between hover:bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <span className="text-2xl">🍫</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{topping.name}</h3>
                        {topping.category && (
                          <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                            {topping.category}
                          </span>
                        )}
                        {!topping.is_active && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        + R$ {topping.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={topping.is_active}
                      onCheckedChange={() => toggleActive(topping)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(topping)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(topping.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Toppings;
