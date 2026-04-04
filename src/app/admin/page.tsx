"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, TrendingUp, Building2 } from "lucide-react";
import { fetchPartners } from "@/lib/api/partners";
import { fetchAllProducts } from "@/lib/api/products";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    partners: 0,
    products: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const partners = await fetchPartners();
      const products = await fetchAllProducts();
      setStats({
        partners: partners.length,
        products: products.length,
      });
    }
    loadStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0a192f]">Vue d'ensemble</h2>
        <p className="text-[#5c6b7a]">Bienvenue sur le tableau de bord administrateur Manara Network.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#dde5ee] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5c6b7a]">Partenaires Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-[#0a192f]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a192f]">{stats.partners}</div>
            <p className="text-xs text-[#5c6b7a]">Entreprises connectées</p>
          </CardContent>
        </Card>
        
        <Card className="border-[#dde5ee] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5c6b7a]">Offres en cours</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#0a192f]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a192f]">{stats.products}</div>
            <p className="text-xs text-[#5c6b7a]">Group buys actifs</p>
          </CardContent>
        </Card>

        <Card className="border-[#dde5ee] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5c6b7a]">Utilisateurs Inscrits</CardTitle>
            <Users className="h-4 w-4 text-[#0a192f]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a192f]">--</div>
            <p className="text-xs text-[#5c6b7a]">Employés vérifiés</p>
          </CardContent>
        </Card>

        <Card className="border-[#dde5ee] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5c6b7a]">Volume Transactionnel</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a192f]">-- DA</div>
            <p className="text-xs text-[#5c6b7a]">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
