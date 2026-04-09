"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addPartner } from "@/lib/api/partners";
import { PartnerCompany } from "@/types/partner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Palette, 
  Globe, 
  Mail,
  CheckCircle2,
  ChevronRight,
  Upload,
  X,
  ImageIcon
} from "lucide-react";
import Link from "next/link";

export default function NewPartnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    initials: "",
    domain: "",
    primaryColor: "#0a192f",
    hrAdminEmail: "",
    logoUrl: "",
    welcomeMessage: "",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const partnerToSave: PartnerCompany = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        sector: formData.sector,
        initials: formData.initials.toUpperCase(),
        domains: [formData.domain],
        hrAdminEmail: formData.hrAdminEmail,
        logoUrl: formData.logoUrl || undefined,
        branding: {
          primaryColor: formData.primaryColor,
          welcomeMessage: formData.welcomeMessage || `Bienvenue à la famille ${formData.name}`,
        }
      };

      await addPartner(partnerToSave);
      router.push("/admin/partners");
    } catch (error) {
      console.error("Error saving partner:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/partners" 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Nouveau Partenaire</h1>
            <p className="text-sm text-slate-500 mt-1">Ajoutez une nouvelle entreprise au réseau Manara.</p>
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
            {loading ? "Chargement..." : <><Save className="h-4 w-4" /> Enregistrer le partenaire</>}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1: Identity */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Identité de l'entreprise</h2>
              </div>
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nom de l'organisation</label>
                    <Input 
                      placeholder="ex: Sonatrach, Renault Algérie..." 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Secteur d'activité</label>
                      <Input 
                        placeholder="ex: Énergie, Automobile..." 
                        value={formData.sector}
                        onChange={e => setFormData({ ...formData, sector: e.target.value })}
                        className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Initiales (Logo temporaire)</label>
                      <Input 
                        placeholder="ex: SN" 
                        maxLength={2}
                        value={formData.initials}
                        onChange={e => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                        className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500 uppercase font-mono tracking-widest text-center"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 2: Branding */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Palette className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold">Branding & Personnalisation</h2>
              </div>
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-purple-500" />
                      Logo de l'entreprise <span className="text-xs text-slate-400 font-normal">(Optionnel)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div 
                        className="relative h-24 w-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-inner flex-shrink-0 overflow-hidden cursor-pointer group border-2 border-dashed border-slate-200 hover:border-purple-300 transition-colors"
                        style={{ backgroundColor: formData.logoUrl ? '#ffffff' : formData.primaryColor }}
                        onClick={() => logoInputRef.current?.click()}
                      >
                        {formData.logoUrl ? (
                          <>
                            <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="h-5 w-5 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="group-hover:hidden">{formData.initials || "?"}</span>
                            <Upload className="hidden group-hover:block h-6 w-6" />
                          </>
                        )}
                      </div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {formData.logoUrl ? "Changer le logo" : "Importer un logo"}
                        </button>
                        {formData.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X className="h-3 w-3" /> Supprimer
                          </button>
                        )}
                        <p className="text-[10px] text-slate-400">PNG, JPG, SVG • Taille recommandée : 200×200px</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-inner flex-shrink-0" style={{ backgroundColor: formData.primaryColor }}>
                        {formData.initials || "?"}
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Couleur d'identité (Primaire)</label>
                        <div className="flex gap-3">
                          <Input 
                            type="color" 
                            value={formData.primaryColor}
                            onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="w-16 h-10 p-1 cursor-pointer"
                          />
                          <Input 
                            type="text" 
                            value={formData.primaryColor.toUpperCase()}
                            onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic mt-3">
                      Cette couleur sera utilisée pour l'interface personnalisée des employés de cette entreprise.
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                      Message de bienvenue <span className="text-xs text-slate-400 font-normal">(Optionnel)</span>
                    </label>
                    <Input 
                      placeholder={`ex: Bienvenue à la famille ${formData.name || 'Entreprise'} !`}
                      value={formData.welcomeMessage}
                      onChange={e => setFormData({ ...formData, welcomeMessage: e.target.value })}
                      className="focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Affiché aux employés lors de leur première connexion. Laissez vide pour un message par défaut.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: Access */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Globe className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Accès & Sécurité</h2>
              </div>
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Domaine email corporatif</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</div>
                      <Input 
                        placeholder="entreprise.dz" 
                        value={formData.domain}
                        onChange={e => setFormData({ ...formData, domain: e.target.value })}
                        className="pl-8 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Seuls les utilisateurs avec cet email pourront rejoindre ce groupe.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="text-sm font-bold text-[#FF6600] flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      Email Administrateur RH
                    </label>
                    <Input 
                      type="email" 
                      placeholder="hr-admin@entreprise.dz" 
                      value={formData.hrAdminEmail} 
                      onChange={e => setFormData({ ...formData, hrAdminEmail: e.target.value })}
                      className="border-orange-100 focus-visible:ring-orange-500/10 focus-visible:border-orange-500"
                    />
                    <div className="mt-2 bg-orange-50 p-3 rounded-lg border border-orange-100/50">
                       <p className="text-[10px] text-orange-800 leading-relaxed font-medium">
                         L'administrateur RH pourra consulter les statistiques d'achat et la progression des offres pour ses employés.
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Preview Area */}
          <div className="lg:col-span-4 space-y-6">
             <div className="sticky top-28 space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Aperçu Visuel</h3>
                
                {/* Brand Experience Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden">
                   <div style={{ backgroundColor: formData.primaryColor }} className="h-32 p-6 flex flex-col justify-end relative">
                      <div className={`absolute top-4 right-4 h-12 w-12 backdrop-blur-md rounded-xl flex items-center justify-center font-bold overflow-hidden ${formData.logoUrl ? 'bg-white' : 'bg-white/20 text-white'}`}>
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                          formData.initials || "M"
                        )}
                      </div>
                      <div className="text-white">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Plateforme Partenaire</p>
                        <h4 className="text-lg font-black truncate">{formData.name || "Nom Entreprise"}</h4>
                      </div>
                   </div>
                   <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Message de bienvenue</p>
                        <p className="text-sm text-slate-700 italic">"{formData.welcomeMessage || `Bienvenue à la famille ${formData.name || '...'}`}"</p>
                      </div>
                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                         <span className="text-xs font-medium text-slate-500">Statut Réseau</span>
                         <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">Prêt à activer</span>
                      </div>
                   </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#0a192f] rounded-2xl p-6 text-white">
                   <h3 className="font-bold flex items-center gap-2 mb-3">
                     <CheckCircle2 className="h-4 w-4 text-blue-400" />
                     Pourquoi ce partenaire ?
                   </h3>
                   <ul className="space-y-2">
                     <li className="flex gap-2 text-xs text-blue-100/70">
                       <ChevronRight className="h-3 w-3 mt-0.5 text-blue-400" />
                       Accès exclusif aux offres premium
                     </li>
                     <li className="flex gap-2 text-xs text-blue-100/70">
                       <ChevronRight className="h-3 w-3 mt-0.5 text-blue-400" />
                       Reporting dédié pour les RH
                     </li>
                     <li className="flex gap-2 text-xs text-blue-100/70">
                       <ChevronRight className="h-3 w-3 mt-0.5 text-blue-400" />
                       Validation automatique par domaine
                     </li>
                   </ul>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
