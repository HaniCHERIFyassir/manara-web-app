"use client";

import { useState, useEffect } from "react";
import { fetchAllProducts, deleteProduct } from "@/lib/api/products";
import { fetchPartners } from "@/lib/api/partners";
import { Product } from "@/types/product";
import { PartnerCompany } from "@/types/partner";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Users, Edit, Trash2, Star } from "lucide-react";
import { Countdown } from "@/components/ui/countdown";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<PartnerCompany[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, parts] = await Promise.all([
        fetchAllProducts(),
        fetchPartners()
      ]);
      setProducts(prods.reverse());
      setPartners(parts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      await deleteProduct(id);
      await loadData();
    }
  };

  return (
    <div className="p-8 space-y-8 text-[#0a192f] bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Produits & Offres</h2>
          <p className="text-slate-500 mt-1">Gérez le catalogue d'achats groupés pour l'ensemble du réseau.</p>
        </div>
        
        <Link href="/admin/products/new">
          <Button className="bg-[#0a192f] text-white hover:bg-[#1e3a5f] shadow-lg shadow-blue-900/10 px-6 py-6 h-auto font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="mr-2 h-5 w-5" /> Ajouter une offre
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-slate-500 font-medium">Chargement des offres...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucune offre active</h3>
            <p className="text-slate-500 mt-1">Commencez par créer votre premier achat groupé.</p>
            <Link href="/admin/products/new" className="mt-6 inline-block">
              <Button variant="outline" className="border-slate-200">Créer une offre</Button>
            </Link>
          </div>
        ) : (
          products.map((product) => {
            const targetPartners = product.tenantIds && product.tenantIds.length > 0
              ? partners.filter(p => product.tenantIds?.includes(p.id))
              : [];
            
            return (
              <Card key={product.id} className="border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow group rounded-2xl">
                <div className="h-48 md:h-auto md:w-72 bg-slate-100 flex-shrink-0 relative overflow-hidden">
                   <img 
                    src={product.images[0] || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                   <div className="absolute top-3 right-3">
                      <Countdown endDate={product.endDate} />
                   </div>
                   {product.isHero && (
                     <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                       <Star className="h-3 w-3 fill-yellow-900" /> Vedette
                     </div>
                   )}
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
                            {product.category}
                          </span>
                          {targetPartners.length > 0 ? (
                            <div className="flex -space-x-2">
                              {targetPartners.map(tp => (
                                <div 
                                  key={tp.id} 
                                  title={tp.name}
                                  className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                                  style={{ backgroundColor: tp.branding?.primaryColor || '#0a192f' }}
                                >
                                  {tp.initials}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                              Global
                            </span>
                          )}
                        </div>
                         <CardTitle className="text-2xl text-slate-900 font-bold tracking-tight">
                           {product.name}
                         </CardTitle>
                         <CardDescription className="text-slate-500 line-clamp-1 max-w-xl">
                          {product.description}
                        </CardDescription>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">{product.price.toLocaleString()} <span className="text-sm font-bold text-slate-400">DA</span></div>
                        {product.retailPrice && (
                          <div className="text-xs text-slate-400 font-medium line-through">Public: {product.retailPrice.toLocaleString()} DA</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inscriptions</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>{product.currentParticipants} / {product.minParticipants}</span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Échéance</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>{new Date(product.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <button className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 bg-slate-50 rounded-xl transition-all border border-transparent hover:border-blue-100 group/btn">
                             <Edit className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </Link>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-3 text-slate-600 hover:text-red-600 hover:bg-red-50 bg-slate-50 rounded-xl transition-all border border-transparent hover:border-red-100 group/btn">
                           <Trash2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                     </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
