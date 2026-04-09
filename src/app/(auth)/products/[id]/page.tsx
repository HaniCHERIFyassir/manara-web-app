"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { fetchProductById } from "@/lib/api/products"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ShoppingCart, 
  Users, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Loader2,
  Star,
  Trash2
} from "lucide-react"
import { Countdown } from "@/components/ui/countdown"
import { QuantitySelector } from "@/components/ui/quantity-selector"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { tenant } = useAuth()
  const { items, addItem, updateQuantity, removeItem } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    async function loadProduct() {
      if (id) {
        setLoading(true)
        const data = await fetchProductById(id as string)
        setProduct(data)
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a192f]" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0a192f]">Produit non trouvé</h2>
        <Button onClick={() => router.back()}>Retour au catalogue</Button>
      </div>
    )
  }

  const primaryColor = tenant?.branding?.primaryColor || "#0a192f"
  const progress = (product.currentParticipants / (product.minParticipants || 10)) * 100
  const images = product.images.length > 0 ? product.images : ["/placeholder.png"]

  return (
    <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#5c6b7a] hover:text-[#0a192f] transition-colors font-medium mb-4"
      >
        <ChevronLeft className="h-4 w-4" /> Retour aux offres
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50">
        {/* Left: Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group">
            <Image
              src={images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-red-50 text-red-600 border-none uppercase text-xs font-bold px-3">
                  {product.category}
                </Badge>
                {product.isHero && (
                  <Badge className="bg-orange-50 text-orange-600 border-none uppercase text-xs font-bold px-3 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-orange-500" /> Vedette
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">{product.name}</h1>
            </div>

            <div className="flex flex-col space-y-1 p-6 bg-red-50 rounded-2xl border border-red-100">
               <span className="text-sm font-bold text-red-600 uppercase">Prix Manara Exclusive</span>
               <div className="flex items-baseline gap-4">
                 <span className="text-5xl font-black text-red-600">{product.price.toLocaleString()} DZD</span>
                 {product.retailPrice && (
                   <span className="text-xl text-[#5c6b7a] line-through font-medium opacity-50">
                     {product.retailPrice.toLocaleString()} DZD
                   </span>
                 )}
               </div>
               {product.retailPrice && (
                 <p className="text-sm font-bold text-green-600">
                   Économisez {(product.retailPrice - product.price).toLocaleString()} DZD (-{Math.round(((product.retailPrice - product.price) / product.retailPrice) * 100)}%)
                 </p>
               )}
            </div>

            <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-[#0a192f] font-bold">
                    <Clock className="h-5 w-5 text-red-500" />
                    <span>L'offre se termine dans :</span>
                  </div>
                  <div className="text-xl font-black text-red-600 tracking-widest">
                    <Countdown endDate={product.endDate} />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm font-bold text-[#0a192f]">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> {product.currentParticipants} Collaborateurs inscrits
                    </span>
                    <span>Objectif: {product.minParticipants}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  {progress < 100 ? (
                    <p className="text-xs text-[#5c6b7a] font-medium italic">
                      Encore {product.minParticipants - product.currentParticipants} participants pour débloquer le prix !
                    </p>
                  ) : (
                    <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Prix de groupe validé !
                    </p>
                  )}
                </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-bold text-[#0a192f] mb-3">Description</h3>
              <p className="text-base text-[#5c6b7a] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
               <div className="flex items-center gap-3 text-xs font-bold text-[#5c6b7a] bg-gray-50 p-3 rounded-lg">
                 <ShieldCheck className="h-4 w-4 text-green-500" /> Paiement Sécurisé
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-[#5c6b7a] bg-gray-50 p-3 rounded-lg">
                 <Truck className="h-4 w-4 text-blue-500" /> Livraison Gratuite
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-[#5c6b7a] bg-gray-50 p-3 rounded-lg">
                 <RotateCcw className="h-4 w-4 text-orange-500" /> 14 Jours Retour
               </div>
            </div>
          </div>

          {(() => {
            const cartItem = items.find(item => item.id === product.id);
            const quantityInCart = cartItem?.quantity || 0;

            if (quantityInCart === 0) {
              return (
                <div className="mt-12">
                  <Button 
                     className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-xl shadow-xl shadow-red-200 uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                     onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" /> Profiter de l'offre
                  </Button>
                </div>
              );
            }

            if (product.maxQuantityPerUser === 1) {
              return (
                <div className="mt-12">
                  <Button 
                     variant="outline"
                     className="w-full h-16 border-red-600 text-red-600 hover:bg-red-50 font-black text-xl shadow-xl shadow-red-100 uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                     onClick={() => removeItem(product.id)}
                  >
                    <Trash2 className="mr-3 h-6 w-6" /> Retirer de l'offre
                  </Button>
                </div>
              );
            }

            return (
              <div className="mt-12 flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex-shrink-0">
                   <div className="text-[10px] uppercase font-bold text-[#5c6b7a] mb-2 text-center">Quantité ajoutée</div>
                   <QuantitySelector 
                    quantity={quantityInCart} 
                    max={product.maxQuantityPerUser} 
                    onChange={(val) => updateQuantity(product.id, val)}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[#0a192f] font-bold">{quantityInCart} article(s) dans votre panier.</p>
                  <p className="text-sm text-[#5c6b7a]">Vous avez atteint le prix préférentiel !</p>
                </div>
                <Button 
                   variant="ghost"
                   className="text-red-500 hover:bg-red-100/50 rounded-full h-12 w-12 flex-shrink-0"
                   onClick={() => removeItem(product.id)}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            );
          })()}
        </div>
      </div>
    </main>
  )
}
