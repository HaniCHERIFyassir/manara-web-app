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
import { ShoppingCart, Users, TrendingUp, Clock, Loader2, Star, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Countdown } from "@/components/ui/countdown";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import Link from "next/link";

export default function DashboardPage() {
  const { user, tenant } = useAuth();
  const { items, addItem, updateQuantity, removeItem } = useCart();
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
      {/* New Premium Branding Bar */}
      <div
        className="w-full h-16 md:h-20 mb-6 rounded-2xl overflow-hidden shadow-lg flex items-center px-6 md:px-8 transition-all"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="bg-white px-6 py-2 rounded-xl shadow-md flex items-center justify-center min-w-[140px] h-[60px]">
          {tenant?.logoUrl ? (
            <div className="relative w-32 h-10">
              {tenant.logoUrl.startsWith('data:') ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          ) : (
            <span className="text-2xl font-black" style={{ color: primaryColor }}>{tenant?.name || "M"}</span>
          )}
        </div>
      </div>

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
      </div>

      {/* Stats Section - Visible only to HR Admins */}
      {user?.role === "hr_admin" && (
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
      )}

      {/* Products Catalog - Visible only to Employees */}
      {user?.role !== "hr_admin" && (
        <div className="space-y-12">
          {/* Hero Section */}
          {products.find(p => p.isHero) && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0a192f] flex items-center gap-2">
                <Star className="h-5 w-5 fill-[#FF6400] text-[#FF6400]" /> Offre Vedette
              </h2>
              {(() => {
                const hero = products.find(p => p.isHero)!;
                const progress = (hero.currentParticipants / (hero.minParticipants || 10)) * 100;
                const cartItem = items.find(item => item.id === hero.id);
                const quantityInCart = cartItem?.quantity || 0;

                return (
                  <Card className="overflow-hidden shadow-xl transition-all hover:shadow-2xl max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative aspect-[16/9] md:w-1/2 overflow-hidden bg-gray-100">
                        <Link href={`/products/${hero.id}`}>
                          {(hero.images[0] || "").startsWith('data:') ? (
                            <img
                              src={hero.images[0]}
                              alt={hero.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                          ) : (
                            <Image
                              src={hero.images[0] || "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"}
                              alt={hero.name}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-105"
                              priority
                            />
                          )}
                        </Link>
                      </div>
                      <div className="p-8 md:w-1/2 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge className="mb-2 bg-red-100 text-red-600 hover:bg-red-200 border-none uppercase text-[10px] font-bold">
                                {hero.category}
                              </Badge>
                              <Link href={`/products/${hero.id}`}>
                                <CardTitle className="text-3xl font-extrabold text-[#0a192f] hover:text-red-500 transition-colors">
                                  {hero.name}
                                </CardTitle>
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-red-600">{hero.price.toLocaleString()} DZD</span>
                            {hero.retailPrice && (
                              <span className="text-lg text-[#5c6b7a] line-through font-medium opacity-60">
                                {hero.retailPrice.toLocaleString()} DZD
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-base text-[#5c6b7a] leading-relaxed line-clamp-3">
                            {hero.description}
                          </CardDescription>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-bold text-[#0a192f]">
                            <span>{hero.currentParticipants} inscrits</span>
                            <span>Objectif: {hero.minParticipants}</span>
                          </div>
                          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 transition-all duration-1000 progress-active-container"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>

                        {quantityInCart === 0 ? (
                          <Button
                            className="w-full h-14 bg-[#0a192f] hover:bg-[#152a45] text-white font-black text-lg shadow-lg shadow-blue-100 uppercase tracking-wider transition-all"
                            onClick={() => addItem(hero)}
                          >
                            <ShoppingCart className="mr-3 h-6 w-6" />
                            Profiter de l'offre
                          </Button>
                        ) : hero.maxQuantityPerUser === 1 ? (
                          <Button
                            variant="outline"
                            className="w-full h-14 border-red-600 text-red-600 hover:bg-red-50 font-black text-lg uppercase tracking-wider transition-all"
                            onClick={() => removeItem(hero.id)}
                          >
                            <Trash2 className="mr-3 h-6 w-6" />
                            Retirer de l'offre
                          </Button>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center gap-6 bg-red-50 p-4 rounded-2xl border border-red-100">
                            <div className="flex-1 text-center sm:text-left">
                              <div className="text-[10px] uppercase font-bold text-red-600 mb-1">Quantité ajoutée</div>
                              <div className="text-xl font-black text-[#0a192f]">{quantityInCart} article(s)</div>
                            </div>

                            <div className="flex items-center gap-4">
                              <QuantitySelector
                                quantity={quantityInCart}
                                max={hero.maxQuantityPerUser}
                                onChange={(val) => updateQuantity(hero.id, val)}
                              />
                              <div className="h-8 w-px bg-red-200 mx-2 hidden sm:block" />
                              <Button
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-100/50 rounded-full h-12 w-12"
                                onClick={() => removeItem(hero.id)}
                              >
                                <Trash2 className="h-6 w-6" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* RED COUNTDOWN BAR */}
                    <div className="py-3 text-center" style={{ backgroundColor: primaryColor }}>
                      <div className="text-white text-2xl font-black tracking-[0.2em]">
                        <Countdown endDate={hero.endDate} />
                      </div>
                    </div>
                  </Card>
                );
              })()}
            </div>
          )}

          {/* Featured Grid (4 products) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0a192f]">Autres Offres Actives</h2>
              <Badge variant="outline" className="bg-[#f4f7fb] text-[#0a192f] border-gray-200">
                {products.filter(p => !p.isHero).length} disponibles
              </Badge>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.filter(p => !p.isHero).slice(0, 4).map((product) => {
                const progress = (product.currentParticipants / (product.minParticipants || 10)) * 100;
                const cartItem = items.find(item => item.id === product.id);
                const quantityInCart = cartItem?.quantity || 0;

                return (
                  <Card key={product.id} className="group flex flex-col overflow-hidden border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px]">
                    <Link href={`/products/${product.id}`} className="relative aspect-video overflow-hidden bg-gray-50 border-b border-gray-100">
                      {(product.images[0] || "").startsWith('data:') ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Image
                          src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-white/90 backdrop-blur-sm text-[#0a192f] border-none text-[9px] font-bold uppercase">
                          {product.category}
                        </Badge>
                      </div>
                    </Link>

                    <CardHeader className="p-4 space-y-2">
                      <Link href={`/products/${product.id}`}>
                        <CardTitle className="text-base font-bold text-[#0a192f] line-clamp-1 hover:text-red-500 transition-colors">
                          {product.name}
                        </CardTitle>
                      </Link>
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-red-600">{product.price.toLocaleString()} DZD</span>
                        {product.retailPrice && (
                          <span className="text-[10px] text-[#5c6b7a] line-through font-medium opacity-60">
                            {product.retailPrice.toLocaleString()} DZD
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs text-[#5c6b7a] line-clamp-2 leading-relaxed">
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black text-[#0a192f]">
                          <span>{product.currentParticipants} inscrits</span>
                          <span>{product.minParticipants}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all duration-1000 progress-active-container"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        {quantityInCart === 0 ? (
                          <Button
                            className="w-full bg-[#0a192f] hover:bg-[#152a45] text-white font-bold h-10 uppercase text-xs transition-all shadow-sm"
                            onClick={() => addItem(product)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Ajouter au panier
                          </Button>
                        ) : (
                          <div className="flex flex-col gap-2 bg-red-50 p-2 rounded-xl border border-red-100 relative z-10">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[9px] uppercase font-bold text-red-600">Quantité</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                type="button"
                                className="text-red-500 rounded-full h-7 w-7 hover:bg-red-200/50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(product.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-center pb-1">
                              <QuantitySelector
                                quantity={quantityInCart}
                                max={product.maxQuantityPerUser}
                                onChange={(val) => updateQuantity(product.id, val)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* MINI COUNTDOWN BAR */}
                    <div className="py-4 text-center mt-auto" style={{ backgroundColor: primaryColor }} >
                      <div className="text-white text-xl font-black tracking-widest">
                        <Countdown endDate={product.endDate} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
