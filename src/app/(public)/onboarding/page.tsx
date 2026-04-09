"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MapPin, Loader2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { ALGERIAN_WILAYAS } from "@/lib/constants/wilayas";

export default function OnboardingPage() {
  const { user, updateOnboarding, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    state: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && user?.onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateOnboarding({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          zip: formData.zip,
          state: formData.state,
        },
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--brand-surface)] px-4 py-12 sm:px-6">
      <div className="w-full max-w-2xl">
        <Card className="border-[var(--brand-border)] shadow-xl overflow-hidden">
          <div className="bg-[#0a192f] px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Complétez votre profil</h1>
            <p className="mt-2 text-white/70">
              Bienvenue sur Manara Network. Nous avons besoin de quelques informations 
              supplémentaires pour finaliser votre accès.
            </p>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-[#0a192f]">Prénom</label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className="h-11 border-[var(--brand-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-[#0a192f]">Nom</label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="h-11 border-[var(--brand-border)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-[#0a192f]">Numéro de téléphone</label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+213..."
                    className="h-11 pl-10 border-[var(--brand-border)]"
                  />
                  <Phone className="absolute top-3 left-3 size-5 text-[#5c6b7a]" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a192f]/60">Adresse de résidence</h3>
                
                <div className="space-y-2">
                  <label htmlFor="street" className="text-sm font-medium text-[#0a192f]">Rue</label>
                  <div className="relative">
                    <Input
                      id="street"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Ex: 12 Rue de l'Indépendance"
                      className="h-11 pl-10 border-[var(--brand-border)]"
                    />
                    <MapPin className="absolute top-3 left-3 size-5 text-[#5c6b7a]" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-[#0a192f]">Ville</label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Alger"
                      className="h-11 border-[var(--brand-border)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium text-[#0a192f]">Code Postal</label>
                    <Input
                      id="zip"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="16000"
                      className="h-11 border-[var(--brand-border)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium text-[#0a192f]">Wilaya</label>
                    <div className="relative">
                      <select
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="h-11 w-full appearance-none rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 outline-none"
                      >
                        <option value="">Sélectionnez une wilaya</option>
                        {ALGERIAN_WILAYAS.map((wilaya) => (
                          <option key={wilaya.id} value={wilaya.name}>
                            {wilaya.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-[#5c6b7a]" />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#0a192f] text-white hover:bg-[#152a45]"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <>
                    Finaliser mon profil
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
