"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { addProduct, fetchAllProducts, updateProduct } from "@/lib/api/products";
import { fetchPartners } from "@/lib/api/partners";
import { Product } from "@/types/product";
import { PartnerCompany } from "@/types/partner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  ImageIcon, 
  Star, 
  Users, 
  Clock, 
  Package, 
  Tag, 
  Target,
  Plus,
  X,
  Upload,
  Link2
} from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<PartnerCompany[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    retailPrice: "",
    images: [] as string[],
    minParticipants: "10",
    daysUntilEnd: "7",
    tenantIds: [] as string[],
    maxQuantityPerUser: "1",
    isHero: false,
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPartners = async () => {
      const data = await fetchPartners();
      setPartners(data);
    };
    loadPartners();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate endDate
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(formData.daysUntilEnd));

      const productToSave: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category || "General",
        price: parseInt(formData.price),
        retailPrice: formData.retailPrice ? parseInt(formData.retailPrice) : undefined,
        images: formData.images.filter(img => img !== ""),
        maxQuantityPerUser: parseInt(formData.maxQuantityPerUser) || 1,
        isHero: formData.isHero,
        minParticipants: parseInt(formData.minParticipants) || 10,
        currentParticipants: 0,
        endDate: endDate.toISOString(),
        tenantIds: formData.tenantIds.length > 0 ? formData.tenantIds : undefined,
      };

      // If new product is Hero, remove Hero status from others
      if (productToSave.isHero) {
        const allProds = await fetchAllProducts();
        for (const p of allProds) {
          if (p.isHero) {
            await updateProduct({ ...p, isHero: false });
          }
        }
      }

      await addProduct(productToSave);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTenant = (id: string) => {
    setFormData(prev => {
      const isSelected = prev.tenantIds.includes(id);
      const newIds = isSelected
        ? prev.tenantIds.filter(tid => tid !== id)
        : [...prev.tenantIds, id];
      return { ...prev, tenantIds: newIds };
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products" 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Nouvelle Offre</h1>
            <p className="text-sm text-slate-500 mt-1">Créez un nouvel achat groupé pour le réseau.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#0a192f] hover:bg-[#162a4a] text-white shadow-lg shadow-blue-900/10 flex items-center gap-2"
          >
            {loading ? "Chargement..." : <><Save className="h-4 w-4" /> Lancer l'offre</>}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: General Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Informations Générales</h2>
            </div>
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nom du produit</label>
                  <Input 
                    placeholder="ex: iPhone 15 Pro Max" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Catégorie</label>
                    <Input 
                      placeholder="ex: Électronique" 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Quantité max / utilisateur</label>
                    <Input 
                      type="number"
                      min="1"
                      value={formData.maxQuantityPerUser}
                      onChange={e => setFormData({ ...formData, maxQuantityPerUser: e.target.value })}
                      className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea 
                    placeholder="Décrivez les avantages de cette offre..." 
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Pricing & Goals */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Tag className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Tarification & Objectifs</h2>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Prix Groupé (Manara) <span className="text-xs text-slate-400 font-normal ml-1">DA</span></label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="pl-4 pr-12 font-bold text-lg text-blue-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">DA</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Prix Public (Conseillé) <span className="text-xs text-slate-400 font-normal ml-1">DA</span></label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={formData.retailPrice}
                        onChange={e => setFormData({ ...formData, retailPrice: e.target.value })}
                        className="pl-4 pr-12 text-slate-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">DA</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Participants Minimum</label>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-slate-400" />
                      <Input 
                        type="number" 
                        min="1"
                        value={formData.minParticipants}
                        onChange={e => setFormData({ ...formData, minParticipants: e.target.value })}
                        className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">L'offre ne sera validée que si ce nombre est atteint.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Durée de l'offre</label>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <Input 
                        type="number" 
                        min="1"
                        value={formData.daysUntilEnd}
                        onChange={e => setFormData({ ...formData, daysUntilEnd: e.target.value })}
                        className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                      <span className="text-sm text-slate-500">jours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Media */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <ImageIcon className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Médias du produit</h2>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-slate-500">Ajoutez des images via URL ou en les important depuis votre ordinateur.</p>
                
                {/* Current images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-[10px] font-bold text-white uppercase">Image {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add image controls */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Coller une URL d'image..." 
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                        className="pl-9"
                      />
                    </div>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={addImageUrl}
                      disabled={!newImageUrl.trim()}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full sm:w-auto border-purple-200 text-purple-600 hover:bg-purple-50 gap-2"
                    >
                      <Upload className="h-4 w-4" /> Importer
                    </Button>
                  </div>
                </div>

                {formData.images.length === 0 && (
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-colors"
                  >
                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-600">Glissez ou cliquez pour importer</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP &bull; Ou collez une URL ci-dessus</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Target Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Target className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Ciblage</h2>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, tenantIds: [] }))}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.tenantIds.length === 0 
                    ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/5" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${formData.tenantIds.length === 0 ? "border-blue-600" : "border-slate-300"}`}>
                      {formData.tenantIds.length === 0 && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Toutes les entreprises</span>
                      <span className="text-xs text-slate-500">Offre disponible pour tout le réseau Manara.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-3">Ou restreindre à certains partenaires</span>
                  <div className="flex flex-wrap gap-2">
                    {partners.map(p => {
                      const isSelected = formData.tenantIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleTenant(p.id)}
                          style={{ 
                            borderColor: isSelected ? p.branding?.primaryColor || '#0a192f' : '#e2e8f0',
                            backgroundColor: isSelected ? `${p.branding?.primaryColor || '#0a192f'}10` : 'white'
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border-2 transition-all flex items-center gap-2 ${
                            isSelected ? "text-slate-900 shadow-sm" : "text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: p.branding?.primaryColor || '#0a192f' }}
                          />
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Visibility Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Visibilité</h2>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <label 
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.isHero 
                    ? "border-yellow-400 bg-yellow-50/30 ring-4 ring-yellow-400/5 shadow-sm" 
                    : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <Checkbox 
                    id="isHero" 
                    checked={formData.isHero} 
                    onCheckedChange={(checked) => setFormData({ ...formData, isHero: !!checked })}
                    className="mt-1 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                      Mettre en avant (Hero)
                      <Star className={`h-3 w-3 ${formData.isHero ? "fill-yellow-500 text-yellow-500" : "text-slate-300"}`} />
                    </span>
                    <p className="text-xs text-slate-500 leading-normal">
                      Sera affiché en haut de la page d'accueil avec un design plus imposant. Un seul produit Hero à la fois.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </section>

          {/* Tips Card */}
          <div className="bg-[#0a192f] rounded-2xl p-6 text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
             <div className="relative z-10 space-y-3">
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <Target className="h-5 w-5 text-blue-400" />
                 Conseil Manara
               </h3>
               <p className="text-sm text-blue-100/70 leading-relaxed">
                 Les offres avec un <strong>prix groupé</strong> inférieur de plus de 20% au <strong>prix public</strong> génèrent en moyenne 3x plus d'intérêt de la part des employés.
               </p>
               <div className="pt-2">
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full w-2/3 bg-blue-400" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
