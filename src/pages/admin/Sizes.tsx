import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

interface Size {
  id: string;
  name: string;
  price: number;
  display_order: number;
  is_active: boolean;
}

const Sizes = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    is_active: true,
    display_order: 0,
  });

  const fetchSizes = async () => {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .order('display_order');
    
    if (error) {
      toast.error('Erro ao carregar tamanhos');
    } else {
      setSizes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      is_active: true,
      display_order: sizes.length,
    });
    setEditingSize(null);
    setShowForm(false);
  };

  const handleEdit = (size: Size) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      price: size.price.toString(),
      is_active: size.is_active,
      display_order: size.display_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sizeData = {
      name: formData.name,
      price: parseFloat(formData.price),
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    if (editingSize) {
      const { error } = await supabase
        .from('sizes')
        .update(sizeData)
        .eq('id', editingSize.id);

      if (error) {
        toast.error('Erro ao atualizar tamanho');
      } else {
        toast.success('Tamanho atualizado!');
        resetForm();
        fetchSizes();
      }
    } else {
      const { error } = await supabase
        .from('sizes')
        .insert([sizeData]);

      if (error) {
        toast.error('Erro ao criar tamanho');
      } else {
        toast.success('Tamanho criado!');
        resetForm();
        fetchSizes();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tamanho?')) return;

    const { error } = await supabase.from('sizes').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir tamanho');
    } else {
      toast.success('Tamanho excluído!');
      fetchSizes();
    }
  };

  const toggleActive = async (size: Size) => {
    const { error } = await supabase
      .from('sizes')
      .update({ is_active: !size.is_active })
      .eq('id', size.id);

    if (error) {
      toast.error('Erro ao atualizar tamanho');
    } else {
      fetchSizes();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tamanhos</h1>
            <p className="text-muted-foreground mt-1">Gerencie os tamanhos disponíveis</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Tamanho
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
                {editingSize ? 'Editar Tamanho' : 'Novo Tamanho'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: 300ml, 500ml, 700ml"
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
                    placeholder="12.00"
                    required
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

        {/* Sizes List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </div>
          ) : sizes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum tamanho cadastrado
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sizes.map((size) => (
                <div key={size.id} className="p-4 flex items-center justify-between hover:bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-500">{size.name.replace('ml', '')}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{size.name}</h3>
                        {!size.is_active && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        R$ {size.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={size.is_active}
                      onCheckedChange={() => toggleActive(size)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(size)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(size.id)}
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

export default Sizes;
