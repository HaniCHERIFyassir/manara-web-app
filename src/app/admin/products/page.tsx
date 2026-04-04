"use client";

import { useState, useEffect } from "react";
import { fetchAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/api/products";
import { fetchPartners } from "@/lib/api/partners";
import { Product } from "@/types/product";
import { PartnerCompany } from "@/types/partner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Clock, Users, ArrowRight, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Countdown } from "@/components/ui/countdown";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<PartnerCompany[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    retailPrice: "",
    image: "",
    minParticipants: "",
    daysUntilEnd: "7",
    tenantIds: [] as string[],
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadData = async () => {
    const prods = await fetchAllProducts();
    setProducts(prods.reverse());
    const parts = await fetchPartners();
    setPartners(parts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate endDate
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(newProduct.daysUntilEnd));

    const productToSave: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category || "General",
      price: parseInt(newProduct.price),
      retailPrice: parseInt(newProduct.retailPrice) || undefined,
      images: [newProduct.image || "https://images.unsplash.com/photo-1513116476489-7635e79feb27?auto=format&fit=crop&w=800&q=80"],
      minParticipants: parseInt(newProduct.minParticipants) || 10,
      currentParticipants: 0,
      endDate: endDate.toISOString(),
      tenantIds: newProduct.tenantIds.length > 0 ? newProduct.tenantIds : undefined,
    };

    await addProduct(productToSave);
    await loadData();
    setIsDialogOpen(false);
    // Reset form
    setNewProduct({
      name: "", description: "", category: "", price: "", retailPrice: "", image: "", minParticipants: "", daysUntilEnd: "7", tenantIds: []
    });
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct);
    await loadData();
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      await deleteProduct(id);
      await loadData();
    }
  };

  return (
    <div className="p-8 space-y-8 text-[#0a192f]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produits & Offres</h2>
          <p className="text-[#5c6b7a]">Gérez les achats groupés disponibles pour les employés.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0a192f] text-white hover:bg-[#1e3a5f]">
              <Plus className="mr-2 h-4 w-4" /> Ajouter une offre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouvel achat groupé</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du produit</label>
                  <Input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Input required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea required className="resize-none" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix Groupé (Manara) DA</label>
                  <Input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix Public (Optionnel) DA</label>
                  <Input type="number" value={newProduct.retailPrice} onChange={e => setNewProduct({...newProduct, retailPrice: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL de l'image (Unsplash recommandé)</label>
                <Input value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Objectif (Participants min.)</label>
                  <Input required type="number" min="1" value={newProduct.minParticipants} onChange={e => setNewProduct({...newProduct, minParticipants: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée de l'offre (Jours)</label>
                  <Input required type="number" min="1" value={newProduct.daysUntilEnd} onChange={e => setNewProduct({...newProduct, daysUntilEnd: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ciblage Partenaire</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setNewProduct({...newProduct, tenantIds: []})}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      newProduct.tenantIds.length === 0
                        ? 'bg-[#0a192f] text-white border-[#0a192f]'
                        : 'bg-white text-[#5c6b7a] border-[#dde5ee] hover:bg-gray-50'
                    }`}
                  >
                    Toutes entreprises (Global)
                  </button>
                  {partners.map(p => {
                    const isSelected = newProduct.tenantIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const currentIds = newProduct.tenantIds;
                          const newIds = isSelected
                            ? currentIds.filter(id => id !== p.id)
                            : [...currentIds, p.id];
                          setNewProduct({...newProduct, tenantIds: newIds});
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                          isSelected
                            ? 'bg-[#0a192f] text-white border-[#0a192f]'
                            : 'bg-white text-[#5c6b7a] border-[#dde5ee] hover:bg-gray-50'
                        }`}
                      >
                        {p.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#0a192f] text-white font-bold hover:bg-[#1e3a5f] mt-4">
                Lancer l'offre
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'offre</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom du produit</label>
                    <Input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Catégorie</label>
                    <Input required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea required className="resize-none" rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prix Groupé (Manara) DA</label>
                    <Input required type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prix Public (Optionnel) DA</label>
                    <Input type="number" value={editingProduct.retailPrice || ""} onChange={e => setEditingProduct({...editingProduct, retailPrice: parseInt(e.target.value) || undefined})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL de l'image</label>
                  <Input value={editingProduct.images[0] || ""} onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Objectif (Participants min.)</label>
                    <Input required type="number" min="1" value={editingProduct.minParticipants} onChange={e => setEditingProduct({...editingProduct, minParticipants: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Participants Actuels</label>
                    <Input required type="number" min="0" value={editingProduct.currentParticipants} onChange={e => setEditingProduct({...editingProduct, currentParticipants: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ciblage Partenaire</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct({...editingProduct, tenantIds: []})}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        !editingProduct.tenantIds || editingProduct.tenantIds.length === 0
                          ? 'bg-[#0a192f] text-white border-[#0a192f]'
                          : 'bg-white text-[#5c6b7a] border-[#dde5ee] hover:bg-gray-50'
                      }`}
                    >
                      Toutes entreprises (Global)
                    </button>
                    {partners.map(p => {
                      const isSelected = editingProduct.tenantIds?.includes(p.id) || false;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            const currentIds = editingProduct.tenantIds || [];
                            const newIds = isSelected
                              ? currentIds.filter(id => id !== p.id)
                              : [...currentIds, p.id];
                            setEditingProduct({...editingProduct, tenantIds: newIds});
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                            isSelected
                              ? 'bg-[#0a192f] text-white border-[#0a192f]'
                              : 'bg-white text-[#5c6b7a] border-[#dde5ee] hover:bg-gray-50'
                          }`}
                        >
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#0a192f] text-white font-bold hover:bg-[#1e3a5f] mt-4">
                  Mettre à jour
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const targetPartners = product.tenantIds && product.tenantIds.length > 0
            ? partners.filter(p => product.tenantIds?.includes(p.id))
            : [];
          
          return (
            <Card key={product.id} className="border-[#dde5ee] shadow-sm flex flex-col md:flex-row overflow-hidden">
              <div className="h-48 md:h-auto md:w-64 bg-gray-100 flex-shrink-0 relative">
                 <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2">
                    <Countdown endDate={product.endDate} />
                 </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase text-[#5b7fa3] bg-[#e8eef5] px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                        {targetPartners.length > 0 ? (
                          targetPartners.map(tp => (
                            <span key={tp.id} className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: tp.branding?.primaryColor || '#0a192f' }}>
                              {tp.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-bold uppercase text-green-700 bg-green-100 px-2 py-0.5 rounded">
                            Global
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl text-[#0a192f] font-bold">{product.name}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0a192f]">{product.price.toLocaleString()} DA</div>
                      {product.retailPrice && (
                        <div className="text-xs text-[#5c6b7a] line-through">{product.retailPrice.toLocaleString()} DA prix public</div>
                      )}
                    </div>
                  </div>
                  <CardDescription className="mt-4 text-[#5c6b7a] line-clamp-2">
                    {product.description}
                  </CardDescription>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-[#dde5ee] pt-4">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#5c6b7a]">
                        <Users className="h-4 w-4" />
                        <span>{product.currentParticipants} / {product.minParticipants} <span className="font-normal text-xs text-[#5b7fa3]">inscrits</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#5c6b7a]">
                        <Clock className="h-4 w-4" />
                        <span>Fin le {new Date(product.endDate).toLocaleDateString()}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingProduct(product); setIsEditDialogOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-200">
                         <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200">
                         <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
