"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { ManaraLogo } from "@/components/brand/manara-logo";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#avantages", label: "Avantages" },
  { href: "/#partenaires", label: "Partenaires" },
  { href: "/rejoindre-le-reseau", label: "Rejoindre" },
] as const;

function ClaimStamp({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-sm border border-[#c5d4e5] bg-[#eef3f9] px-3 py-1.5 text-center text-[0.65rem] font-semibold uppercase leading-tight tracking-wide text-[#0a192f] sm:text-[0.7rem]",
        className
      )}
    >
      Toujours 100&nbsp;% gratuit pour les employeurs
    </p>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:gap-2">
          <div className="flex items-center gap-3">
            <ManaraLogo priority className="shrink-0" />

            <div className="hidden min-w-0 flex-1 max-md:hidden" aria-hidden />

            <div className="hidden shrink-0 max-md:hidden">
              <ClaimStamp />
            </div>

            <nav
              className="ml-auto hidden items-center gap-7 max-md:ml-auto md:flex"
              aria-label="Principal"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#0a192f]/75 transition-colors hover:text-[#0a192f]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 md:ml-0 md:shrink-0">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "hidden text-[#0a192f]/80 hover:bg-[#f4f7fb] hover:text-[#0a192f] sm:inline-flex"
                )}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "hidden bg-[#0a192f] text-white hover:bg-[#152a45] sm:inline-flex"
                )}
              >
                S&apos;inscrire
              </Link>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-[#0a192f] md:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-end md:hidden">
            <ClaimStamp className="max-w-[12rem]" />
          </div>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-[var(--brand-border)] bg-white px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-[#0a192f]/80 hover:bg-[#f4f7fb]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-[var(--brand-border)]" />
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm text-[#0a192f]/80 hover:bg-[#f4f7fb]"
              onClick={() => setOpen(false)}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "default" }),
                "mt-1 justify-center bg-[#0a192f] text-white hover:bg-[#152a45]"
              )}
              onClick={() => setOpen(false)}
            >
              S&apos;inscrire
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
