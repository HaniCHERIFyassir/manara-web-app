"use client";

import React, { useState } from "react";
import { ShoppingCart, X, Trash2, PackageCheck, MapPin, Phone as PhoneIcon } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, removeItem, totalItems, totalPrice, clearCart, updateQuantity } = useCart();
  const { user, tenant } = useAuth();
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  const primaryColor = tenant?.branding?.primaryColor || "#0a192f";

  if (isOrdered) {
    return (
      <DialogContent className="sm:max-w-md h-[400px] flex flex-col items-center justify-center text-center p-6 bg-white">
        <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <PackageCheck className="size-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0a192f]">Commande confirmée !</h2>
        <p className="mt-2 text-[#5c6b7a]">
          Votre demande a été transmise à {tenant?.name}. <br />
          Vous recevrez une notification par email prochainement.
        </p>
        <Button 
          className="mt-6 w-full text-white" 
          style={{ backgroundColor: primaryColor }}
          onClick={() => setIsOrdered(false)}
        >
          Fermer
        </Button>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md translate-x-0 translate-y-0 rounded-none border-l bg-white p-0 shadow-2xl transition-transform duration-300 data-closed:translate-x-full sm:max-w-md">
      <div className="flex h-full flex-col">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#0a192f]">Ma Sélection</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-[#5c6b7a]">
            {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-[#5c6b7a]">
              <ShoppingCart className="mb-2 size-8 opacity-20" />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4 border-[#e5e7eb]/50">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded bg-[#f4f7fb]">
                    {/* Placeholder for product image if added later */}
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#0a192f]/20 uppercase">
                      {item.name.substring(0, 2)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-bold text-[#0a192f]">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-[#5c6b7a] hover:text-[#0a192f] transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-[#5c6b7a] uppercase tracking-wider">{item.category}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                       <div className="flex items-center border rounded-md px-1 h-7">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 text-sm font-medium"
                        >-</button>
                        <span className="px-2 text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 text-sm font-medium"
                        >+</button>
                       </div>
                       <span className="text-sm font-bold text-[#0a192f]">{item.price} DA</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Minimalist Checkout Form */}
              <div className="mt-8 space-y-6 border-t pt-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0a192f]/40">Informations de livraison</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group relative border-b border-[#e5e7eb] focus-within:border-[#0a192f] transition-colors">
                    <label className="block text-[10px] font-bold uppercase text-[#5c6b7a] mb-1">Téléphone</label>
                    <div className="flex items-center">
                      <PhoneIcon className="mr-2 size-4 text-[#0a192f]/30" />
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[#e5e7eb]"
                        placeholder="+213..."
                      />
                    </div>
                  </div>

                  <div className="group relative border-b border-[#e5e7eb] focus-within:border-[#0a192f] transition-colors">
                    <label className="block text-[10px] font-bold uppercase text-[#5c6b7a] mb-1">Adresse</label>
                    <div className="flex items-center">
                      <MapPin className="mr-2 size-4 text-[#0a192f]/30" />
                      <input 
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[#e5e7eb]"
                        placeholder="Rue et numéro"
                      />
                    </div>
                  </div>

                   <div className="group relative border-b border-[#e5e7eb] focus-within:border-[#0a192f] transition-colors">
                    <label className="block text-[10px] font-bold uppercase text-[#5c6b7a] mb-1">Ville</label>
                    <input 
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[#e5e7eb]"
                      placeholder="Votre ville"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-[#f4f7fb]/50 px-6 py-6 space-y-4">
          <div className="flex justify-between items-center text-[#0a192f]">
            <span className="text-sm font-medium">Total estimé</span>
            <span className="text-lg font-bold">{totalPrice} DA</span>
          </div>
          <Button 
            className="w-full h-12 text-white font-bold transition-all hover:scale-[1.02]" 
            style={{ backgroundColor: primaryColor }}
            disabled={items.length === 0}
            onClick={handleSubmit}
          >
            Confirmer la commande
          </Button>
          <p className="text-[10px] text-center text-[#5c6b7a]">
            * Le paiement se fera lors de la livraison groupée au siège de votre entreprise.
          </p>
        </div>
      </div>
    </DialogContent>
  );
}
