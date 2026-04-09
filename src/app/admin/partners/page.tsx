"use client";

import { useState, useEffect } from "react";
import { fetchPartners, deletePartner } from "@/lib/api/partners";
import { PartnerCompany } from "@/types/partner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Edit, Trash2, Globe, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerCompany[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const data = await fetchPartners();
      setPartners(data.reverse()); // Show newest first
    } catch (error) {
      console.error("Error loading partners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleDeletePartner = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      await deletePartner(id);
      await loadPartners();
    }
  };

  return (
    <div className="p-8 space-y-8 text-[#0a192f] bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Partenaires</h2>
          <p className="text-slate-500 mt-1">Gérez les entreprises membres et personnalisez leur expérience Manara.</p>
        </div>
        
        <Link href="/admin/partners/new">
          <Button className="bg-[#0a192f] text-white hover:bg-[#162a4a] shadow-lg shadow-blue-900/10 px-6 py-6 h-auto font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="mr-2 h-5 w-5" /> Ajouter un partenaire
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" />
          <p className="mt-4 text-slate-500 font-medium">Chargement des partenaires...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucun partenaire</h3>
          <p className="text-slate-500 mt-1">Inscrivez votre première entreprise partenaire pour commencer.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id} className="border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 relative">
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white font-black text-xl text-white shadow-lg"
                  style={{ backgroundColor: partner.branding?.primaryColor || '#0a192f' }}
                >
                  {partner.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg text-slate-900 font-bold truncate group-hover:text-blue-600 transition-colors">{partner.name}</CardTitle>
                  <CardDescription className="text-slate-500 font-medium flex items-center gap-1">
                    {partner.sector}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                   <Link href={`/admin/partners/${partner.id}/edit`}>
                     <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                     </button>
                   </Link>
                   <button onClick={() => handleDeletePartner(partner.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                   </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-2">
                   <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <Globe className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span className="font-semibold truncate">@{partner.domains[0]}</span>
                   </div>
                   {partner.hrAdminEmail && (
                     <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                          <Mail className="h-3.5 w-3.5 text-orange-500" />
                        </div>
                        <span className="font-semibold truncate text-[11px]">{partner.hrAdminEmail}</span>
                     </div>
                   )}
                </div>
                
                <div className="pt-2">
                   <Link href={`/admin/partners/${partner.id}/edit`} className="w-full">
                     <Button variant="ghost" className="w-full text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-0 h-8 flex items-center justify-center gap-2">
                        Gérer le branding <ExternalLink className="h-3 w-3" />
                     </Button>
                   </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
