"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";

import { ManaraLogo } from "@/components/brand/manara-logo";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const navLinks = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#avantages", label: "Avantages" },
  { href: "/#partenaires", label: "Partenaires" },
  { href: "/rejoindre-le-reseau", label: "Rejoindre" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, tenant, logout } = useAuth();
  const { totalItems } = useCart();

  const primaryColor = tenant?.branding?.primaryColor || "#0a192f";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" onClick={(e) => user && e.preventDefault()}>
              <ManaraLogo priority className="shrink-0" />
            </Link>

            {/* Hide links for authenticated users */}
            {!user && (
              <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
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
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden flex-col items-end sm:flex leading-tight text-right">
                  <span className="text-sm font-bold text-[#0a192f]">
                    {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.email}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: primaryColor }}>
                    {tenant?.name}
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger render={
                    <Button variant="ghost" size="icon" className="relative group">
                      <ShoppingCart className="size-5 text-[#0a192f]" />
                      {totalItems > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  } />
                  <CartSheet />
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:flex border-[#0a192f]/10 text-[#0a192f] hover:bg-[#f4f7fb] text-xs font-bold"
                >
                  Déconnexion
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-[#0a192f] md:hidden"
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "bg-[#0a192f] text-white hover:bg-[#152a45] rounded-full px-6"
                  )}
                >
                  Connexion
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-[#0a192f] md:hidden"
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[var(--brand-border)] bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {!user ? (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-[#0a192f]/80 hover:bg-[#f4f7fb]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 border-b mb-2">
                <p className="text-sm font-bold text-[#0a192f]">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[#5c6b7a]">{tenant?.name}</p>
              </div>
            )}
            <hr className="my-2 border-[var(--brand-border)]" />
            {user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="justify-start px-3 h-10 text-[#0a192f] hover:bg-[#f4f7fb]"
              >
                Déconnexion
              </Button>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "mt-1 justify-center bg-[#0a192f] text-white hover:bg-[#152a45]"
                )}
                onClick={() => setOpen(false)}
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
