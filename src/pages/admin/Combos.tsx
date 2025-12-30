import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

interface Combo {
  id: string;
  name: string;
  description: string | null;
  original_price: number | null;
  price: number;
  badge: string | null;
  icon: string | null;
  is_active: boolean;
  display_order: number;
}

const Combos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    price: '',
    badge: '',
    icon: 'Star',
    is_active: true,
    display_order: 0,
  });

  const fetchCombos = async () => {
    const { data, error } = await supabase
      .from('combos')
      .select('*')
      .order('display_order');
    
    if (error) {
      toast.error('Erro ao carregar combos');
    } else {
      setCombos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      original_price: '',
      price: '',
      badge: '',
      icon: 'Star',
      is_active: true,
      display_order: combos.length,
    });
    setEditingCombo(null);
    setShowForm(false);
  };

  const handleEdit = (combo: Combo) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      description: combo.description || '',
      original_price: combo.original_price?.toString() || '',
      price: combo.price.toString(),
      badge: combo.badge || '',
      icon: combo.icon || 'Star',
      is_active: combo.is_active,
      display_order: combo.display_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const comboData = {
      name: formData.name,
      description: formData.description || null,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      price: parseFloat(formData.price),
      badge: formData.badge || null,
      icon: formData.icon || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    if (editingCombo) {
      const { error } = await supabase
        .from('combos')
        .update(comboData)
        .eq('id', editingCombo.id);

      if (error) {
        toast.error('Erro ao atualizar combo');
      } else {
        toast.success('Combo atualizado!');
        resetForm();
        fetchCombos();
      }
    } else {
      const { error } = await supabase
        .from('combos')
        .insert([comboData]);

      if (error) {
        toast.error('Erro ao criar combo');
      } else {
        toast.success('Combo criado!');
        resetForm();
        fetchCombos();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este combo?')) return;

    const { error } = await supabase.from('combos').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir combo');
    } else {
      toast.success('Combo excluído!');
      fetchCombos();
    }
  };

  const toggleActive = async (combo: Combo) => {
    const { error } = await supabase
      .from('combos')
      .update({ is_active: !combo.is_active })
      .eq('id', combo.id);

    if (error) {
      toast.error('Erro ao atualizar combo');
    } else {
      fetchCombos();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Combos</h1>
            <p className="text-muted-foreground mt-1">Gerencie os combos promocionais</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Combo
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/50" onClick={resetForm} />
            <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingCombo ? 'Editar Combo' : 'Novo Combo'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Combo Família"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do combo..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Preço Original (R$)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      placeholder="84.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço Promocional (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="69.90"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge">Badge (opcional)</Label>
                  <Input
                    id="badge"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ex: Mais Pedido, Promoção"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="Star">Estrela</option>
                    <option value="Flame">Fogo</option>
                    <option value="Heart">Coração</option>
                    <option value="Zap">Raio</option>
                  </select>
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

        {/* Combos List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </div>
          ) : combos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum combo cadastrado
            </div>
          ) : (
            <div className="divide-y divide-border">
              {combos.map((combo) => (
                <div key={combo.id} className="p-4 flex items-center justify-between hover:bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <span className="text-2xl">🍨</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{combo.name}</h3>
                        {combo.badge && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                            {combo.badge}
                          </span>
                        )}
                        {!combo.is_active && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {combo.original_price && (
                          <span className="line-through mr-2">R$ {combo.original_price.toFixed(2)}</span>
                        )}
                        <span className="text-accent font-semibold">R$ {combo.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={combo.is_active}
                      onCheckedChange={() => toggleActive(combo)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(combo)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(combo.id)}
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

export default Combos;
