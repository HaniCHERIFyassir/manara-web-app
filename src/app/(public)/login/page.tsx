"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

import { fetchPartnerByDomain } from "@/lib/api/partners";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const domain = email.split("@")[1];
      if (!domain) {
        setError("Adresse email invalide.");
        setIsSubmitting(false);
        return;
      }

      const partner = await fetchPartnerByDomain(domain);
      if (!partner) {
        setError("Votre entreprise n'est pas encore partenaire de Manara Network.");
        setIsSubmitting(false);
        return;
      }

      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep("otp");
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Dummy OTP validation
    if (otp.length < 4) {
      setError("Code invalide. Veuillez réessayer.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(email);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--brand-surface)] px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <Card className="border-[var(--brand-border)] shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#0a192f]">Connexion Employé</CardTitle>
            <CardDescription>
              Entrez votre adresse email professionnelle pour accéder à votre portail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit} className="space-y-4">
              {step === "email" ? (
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#0a192f]">
                    Email Professionnel
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-10 border-[var(--brand-border)]"
                    />
                    <Mail className="absolute top-3.5 left-3 size-5 text-[#5c6b7a]" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-sm text-[#5c6b7a] mb-4">
                    Un code de connexion a été envoyé à <strong>{email}</strong>.
                  </p>
                  <label htmlFor="otp" className="text-sm font-medium text-[#0a192f]">
                    Code de connexion
                  </label>
                  <div className="relative">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="h-12 pl-10 border-[var(--brand-border)] tracking-widest text-lg"
                    />
                    <KeyRound className="absolute top-3.5 left-3 size-5 text-[#5c6b7a]" />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#0a192f] text-white hover:bg-[#152a45]"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#5c6b7a]">
                Votre entreprise n'est pas encore partenaire ?{" "}
                <a href="/rejoindre-le-reseau" className="font-semibold text-[#0a192f] hover:underline">
                  Nous contacter
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
