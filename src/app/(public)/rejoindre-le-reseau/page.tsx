"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Mail, Phone, Globe, MapPin, Building2, User, UserCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { submitLead, LeadType } from "@/lib/api/leads";

type FormType = "company" | "vendor";


export default function JoinNetworkPage() {
  const [formType, setFormType] = useState<LeadType>("partner");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await submitLead({
      type: formType,
      companyName: formData.companyName,
      contactName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <Check className="size-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#0a192f]">
            Demande envoyée !
          </h1>
          <p className="mt-4 text-[#5c6b7a]">
            Merci pour votre intérêt. Notre équipe examinera votre demande et vous contactera dans les plus brefs délais.
          </p>
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "default" }),
              "mt-8 bg-[#0a192f] text-white hover:bg-[#152a45]"
            )}
            onClick={() => setSubmitted(false)}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-[var(--brand-surface)]/50">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        {/* Background blobs for premium look */}
        <div className="pointer-events-none absolute -top-24 -left-20 size-96 rounded-full bg-blue-100/50 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/2 -right-20 size-96 rounded-full bg-slate-100/50 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0a192f] sm:text-4xl md:text-5xl">
              Que pouvons-nous faire pour vous ?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#5c6b7a]">
              Rejoignez le premier réseau d'achat groupé corporate en Algérie. 
              Que vous soyez une entreprise cherchant à valoriser ses salariés ou un partenaire potentiel, nous sommes là pour vous.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-lg border border-[var(--brand-border)] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setFormType("partner")}
                className={cn(
                  "px-6 py-2 text-sm font-medium transition-all rounded-md",
                  formType === "partner"
                    ? "bg-[#0a192f] text-white shadow-sm"
                    : "text-[#5c6b7a] hover:text-[#0a192f]"
                )}
              >
                Pour les Entreprises
              </button>
              <button
                type="button"
                onClick={() => setFormType("retailer")}
                className={cn(
                  "px-6 py-2 text-sm font-medium transition-all rounded-md",
                  formType === "retailer"
                    ? "bg-[#0a192f] text-white shadow-sm"
                    : "text-[#5c6b7a] hover:text-[#0a192f]"
                )}
              >
                Pour les Fournisseurs
              </button>
            </div>
          </div>

          <Card className="border-[var(--brand-border)] bg-white/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="border-b border-[var(--brand-border)]/50 pb-8 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-3 text-[#0a192f]">
                {formType === "partner" ? <Building2 className="size-6 text-[#5b7fa3]" /> : <Globe className="size-6 text-[#5b7fa3]" />}
                <CardTitle className="text-xl">Formulaire de partenariat</CardTitle>
              </div>
              <CardDescription>
                Remplissez les informations ci-dessous et nous vous recontacterons sous 24h.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="px-6 py-10 sm:px-10">
                <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold uppercase tracking-wider text-[#0a192f]/60">Civilité *</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 font-medium cursor-pointer text-[#0a192f]">
                          <input type="radio" name="title" value="ms" className="size-4 accent-[#0a192f]" required />
                          <span>Mme</span>
                        </label>
                        <label className="flex items-center gap-2 font-medium cursor-pointer text-[#0a192f]">
                          <input type="radio" name="title" value="mr" className="size-4 accent-[#0a192f]" />
                          <span>M.</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0a192f]">Prénom</label>
                        <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Votre prénom" className="h-11 border-[var(--brand-border)]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0a192f]">Nom *</label>
                        <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Votre nom" required className="h-11 border-[var(--brand-border)]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">
                        {formType === "partner" ? "Entreprise *" : "Raison sociale *"}
                      </label>
                      <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Nom de la structure" required className="h-11 border-[var(--brand-border)]" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Fonction / Poste *</label>
                      <Input placeholder="Ex: Directeur RH, Gérant..." required className="h-11 border-[var(--brand-border)]" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Nombre d'employés</label>
                      <Input type="number" placeholder="Ex: 50" className="h-11 border-[var(--brand-border)]" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Message *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="min-h-[120px] w-full rounded-lg border border-[var(--brand-border)] bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Adresse</label>
                      <Input placeholder="Adresse complète" className="h-11 border-[var(--brand-border)]" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0a192f]">Code Postal *</label>
                        <Input placeholder="16000" required className="h-11 border-[var(--brand-border)]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0a192f]">Wilaya / Région</label>
                        <Input placeholder="Alger" className="h-11 border-[var(--brand-border)]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Ville</label>
                      <Input placeholder="Ex: Chéraga" className="h-11 border-[var(--brand-border)]" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Pays *</label>
                      <div className="relative">
                        <select
                          required
                          className="h-11 w-full appearance-none rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 outline-none"
                        >
                          <option value="DZ">Algérie</option>
                          <option value="FR">France</option>
                          <option value="TN">Tunisie</option>
                          <option value="MA">Maroc</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-[#5c6b7a]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Adresse E-Mail *</label>
                      <div className="relative">
                        <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="contact@entreprise.com" required className="h-11 pl-10 border-[var(--brand-border)]" />
                        <Mail className="absolute top-3 left-3 size-5 text-[#5c6b7a]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Téléphone</label>
                      <div className="relative">
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" placeholder="+213..." className="h-11 pl-10 border-[var(--brand-border)]" />
                        <Phone className="absolute top-3 left-3 size-5 text-[#5c6b7a]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0a192f]">Site Web de l'entreprise *</label>
                      <div className="relative">
                        <Input placeholder="www.votreentreprise.com" required className="h-11 pl-10 border-[var(--brand-border)]" />
                        <Globe className="absolute top-3 left-3 size-5 text-[#5c6b7a]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[var(--brand-border)] pt-10 sm:flex-row">
                  <p className="text-sm text-[#5c6b7a]">
                    <span className="text-red-500">*</span> Champs obligatoires
                  </p>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 min-w-[200px] rounded-full bg-[#0a192f] px-10 text-base font-bold text-white shadow-xl hover:bg-[#152a45] disabled:opacity-50"
                  >
                    {isLoading ? "Envoi en cours..." : "ENVOYER"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
