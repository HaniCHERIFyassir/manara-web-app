"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { getProductsByTenant } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, TrendingUp, Clock, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { user, tenant } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (user?.tenantId) {
        setIsLoading(true);
        try {
          const tenantProducts = await getProductsByTenant(user.tenantId);
          setProducts(tenantProducts);
        } catch (error) {
          console.error("Failed to load products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadProducts();
  }, [user]);

  const primaryColor = tenant?.branding?.primaryColor || "#0a192f";

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0a192f]" />
          <p className="mt-2 text-sm text-[#5c6b7a]">Chargement de votre catalogue exclusif...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 space-y-8 p-8 pt-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0a192f]">
            Bienvenue, {user?.firstName || "Collaborateur"}
          </h1>
          <p className="text-[#5c6b7a]">
            Voici les offres exclusives réservées aux employés de <span className="font-bold" style={{ color: primaryColor }}>{tenant?.name}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 shadow-sm">
          <div 
            className="h-3 w-3 rounded-full animate-pulse" 
            style={{ backgroundColor: primaryColor }}
          />
          <span className="text-sm font-medium text-[#0a192f]">Session Corporate Active</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--brand-border)] bg-white shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5c6b7a]">Économies réalisées</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a192f]">45,200 DA</div>
            <p className="text-xs text-[#5c6b7a]">Total communauté {tenant?.name}</p>
          </CardContent>
        </Card>
        
        <Card className="border-[var(--brand-border)] bg-white shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5c6b7a]">Membres actifs</CardTitle>
            <Users className="h-4 w-4 text-[#0a192f]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a192f]">128</div>
            <p className="text-xs text-[#5c6b7a]">Inscrit ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0a192f]">Catalogue Exclusif</h2>
          <Badge variant="outline" className="bg-[#f4f7fb] text-[#0a192f] border-[var(--brand-border)]">
            {products.length} Offres disponibles
          </Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const progress = (product.currentParticipants / (product.minParticipants || 10)) * 100;
            const isFull = progress >= 100;

            return (
              <Card key={product.id} className="group flex flex-col overflow-hidden border-[var(--brand-border)] bg-white shadow-sm transition-all hover:shadow-lg hover:translate-y-[-2px]">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 backdrop-blur-sm text-[#0a192f] border-none text-[10px] font-bold uppercase shadow-sm">
                      {product.category}
                    </Badge>
                  </div>
                  {isFull && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <Badge className="bg-green-500 text-white border-none px-3 py-1 font-bold">Prix de groupe atteint !</Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader className="p-4 flex-1">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-bold text-[#0a192f] line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#0a192f]">{product.price.toLocaleString()} DA</span>
                      <span className="text-xs text-[#5c6b7a] line-through font-medium">{(product.price * 1.25).toLocaleString()} DA</span>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-auto">-25%</span>
                    </div>
                    <CardDescription className="text-xs line-clamp-2 text-[#5c6b7a] leading-relaxed">
                      {product.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#5c6b7a]">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" /> {product.currentParticipants} inscrits
                      </span>
                      <span>Obj. {product.minParticipants}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f4f7fb] rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: primaryColor
                        }} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#5c6b7a]">
                    <Clock className="size-3" />
                    <span>L&apos;offre expire le {new Date(product.endDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full text-white font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Commander
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
