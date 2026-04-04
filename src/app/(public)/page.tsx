"use client";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { partnerCompanies } from "@/data/partners";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const employerBenefits = [
  "Un portail digital exclusif et sécurisé",
  "Zéro coût et zéro gestion administrative",
  "Implémentation rapide et sans effort",
  "Kit de communication interne clé en main",
  "Reporting mensuel du gain de pouvoir d’achat",
] as const;

const employeeBenefits = [
  "Accès aux prix de groupe exclusifs",
  "Système de vote pour choisir les prochaines offres",
  "Accès aux offres « Hero Drop » de la communauté",
  "Interface intuitive et optimisée pour mobile",
  "Zéro endettement, zéro frais cachés",
] as const;

const stats = [
  { value: "3+", label: "Années sur le marché" },
  { value: "1", label: "Pays — Algérie" },
  { value: "6+", label: "Grandes entreprises partenaires" },
  { value: "∞", label: "Offres négociées en volume" },
] as const;

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — type corporate-benefits.eu : titre fort, sous-texte, 2 CTA, visuel */}
      <section
        id="accueil"
        className="scroll-mt-24 border-b border-[var(--brand-border)] bg-white px-4 py-14 sm:px-6 lg:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <h1 className="font-heading text-balance text-3xl font-bold leading-[1.15] tracking-tight text-[#0a192f] sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3rem]">
              Nous renforçons la satisfaction de vos collaborateurs.
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-[#5c6b7a] sm:text-lg">
              Portails d&apos;offres groupées pour les salariés : la force du
              collectif, des prix négociés avec les fabricants, une expérience
              simple pour les RH.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/#avantages-employeur"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex h-12 min-w-[11rem] items-center justify-center rounded-md bg-[#0a192f] px-6 text-white hover:bg-[#152a45]"
                )}
              >
                Pour les employeurs
              </Link>
              <Link
                href="/rejoindre-le-reseau"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "inline-flex h-12 min-w-[11rem] items-center justify-center rounded-md border-[#0a192f]/25 bg-white text-[#0a192f] hover:bg-[#f4f7fb]"
                )}
              >
                Pour les fournisseurs
              </Link>
            </div>
          </div>
          <div className="relative order-1 aspect-[5/6] w-full max-w-md justify-self-center overflow-hidden rounded-lg bg-[var(--brand-surface)] shadow-sm lg:order-2 lg:max-w-none lg:justify-self-end">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
              alt="Professionnel en entreprise"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      <section
        id="a-propos"
        className="scroll-mt-24 border-b border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-[#0a192f] sm:text-3xl">
            Nous sommes Manara Network — le pionnier de l&apos;achat groupé
            corporate en Algérie
          </h2>
          <p className="mt-6 text-pretty text-sm leading-relaxed text-[#5c6b7a] sm:text-base">
            La satisfaction au travail impacte directement la performance de
            votre entreprise. Chez Manara Network, nous aidons les directions RH
            à proposer des offres attractives à leurs équipes. Grâce à nos
            portails, vos salariés accèdent à des avantages négociés avec des
            marques et fabricants de référence. Nous mobilisons le collectif pour
            atteindre les volumes cibles et sécuriser les meilleurs prix — avec
            une plateforme fiable, transparente et sans charge administrative
            supplémentaire.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--brand-surface)] shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
              alt="Équipe en réunion"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#0a192f] sm:text-3xl">
              Quel lien entre collaborateurs satisfaits et réussite de
              l&apos;entreprise&nbsp;?
            </h2>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-[#5c6b7a] sm:text-base">
              Vos collaborateurs sont votre ressource la plus précieuse. Plus ils
              se sentent considérés, plus ils sont motivés et fidèles. En leur
              offrant des avantages concrets via l&apos;achat groupé, vous
              renforcez votre image employeur et facilitez le pouvoir d&apos;achat
              au quotidien — sans coût pour l&apos;entreprise.
            </p>
          </div>
        </div>
      </section>

      <section
        id="avantages"
        className="scroll-mt-24 bg-[var(--brand-surface)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-heading text-2xl font-bold text-[#0a192f] sm:text-3xl">
            Avantages pour votre entreprise et vos équipes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#5c6b7a] sm:text-base">
            Tout ce dont vous avez besoin pour lancer et animer votre portail
            salariés.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-white shadow-sm lg:aspect-square lg:w-[240px]">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80"
                  alt="Collaborateurs en entreprise"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 240px"
                />
              </div>
              <div
                id="avantages-employeur"
                className="scroll-mt-28 rounded-lg border border-[var(--brand-border)] bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="font-heading text-lg font-bold text-[#0a192f] sm:text-xl">
                  Avantages en tant qu&apos;employeur
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-[#5c6b7a] sm:text-base">
                  {employerBenefits.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5b7fa3]"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-center">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-white shadow-sm lg:aspect-square lg:w-[240px]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="Collaboratrices au travail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 240px"
                />
              </div>
              <div
                id="avantages-employe"
                className="scroll-mt-28 rounded-lg border border-[var(--brand-border)] bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="font-heading text-lg font-bold text-[#0a192f] sm:text-xl">
                  Avantages en tant qu&apos;employé
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-[#5c6b7a] sm:text-base">
                  {employeeBenefits.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5b7fa3]"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="text-center sm:border-l sm:border-[var(--brand-border)] sm:pl-6 first:sm:border-l-0 first:sm:pl-0"
            >
              <p className="font-heading text-3xl font-bold tabular-nums text-[#0a192f] sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-medium leading-snug text-[#5c6b7a] sm:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="fournisseurs"
        className="scroll-mt-24 border-b border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-14 sm:px-6"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-[#0a192f] sm:text-3xl">
            Pour les fournisseurs
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-[#5c6b7a] sm:text-base">
            Vous êtes fabricant ou distributeur&nbsp;? Proposez vos offres à la
            communauté corporate Manara et bénéficiez de volumes engagés par des
            salariés vérifiés. Contactez-nous pour intégrer le programme
            partenaires.
          </p>
          <Link
            href="/rejoindre-le-reseau"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex h-12 rounded-md bg-[#0a192f] px-8 text-white hover:bg-[#152a45]"
            )}
          >
            Nous rejoindre
          </Link>
        </div>
      </section>

      <section
        id="partenaires"
        className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold text-[#0a192f] sm:text-3xl">
              Une sélection de nos partenaires
            </h2>
            <p className="mt-3 text-sm text-[#5c6b7a] sm:text-base">
              Des organisations de premier plan nous font confiance pour leurs
              équipes.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerCompanies.map((company) => (
              <li key={company.id}>
                <Card className="h-full border-[var(--brand-border)] bg-white shadow-sm ring-0 transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-md border border-[var(--brand-border)] bg-[var(--brand-surface)] font-heading text-lg font-bold text-[#0a192f]"
                      aria-hidden
                    >
                      {company.initials}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base text-[#0a192f]">
                        {company.name}
                      </CardTitle>
                      <CardDescription className="text-[#5c6b7a]">
                        {company.sector}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-[#5c6b7a]/90">
                      Portail salariés et offres groupées
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
