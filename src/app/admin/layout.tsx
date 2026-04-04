"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Contact, LogOut, Bell, Search, UserCircle } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/partners", label: "Partenaires", icon: Users },
  { href: "/admin/products", label: "Produits", icon: ShoppingBag },
  { href: "/admin/retailers", label: "Fournisseurs", icon: Contact },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") return null;

  return (
    <aside className="w-64 border-r border-[#dde5ee] bg-[#f4f7fb] flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-[#dde5ee]">
        <h1 className="text-xl font-bold text-[#0a192f] tracking-tight">Manara <span className="font-light">Admin</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminNav.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#0a192f] text-white" 
                  : "text-[#5c6b7a] hover:bg-[#e8eef5] hover:text-[#0a192f]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#dde5ee]">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function AdminHeader() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-[#dde5ee] bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          {/* Search was removed per user request */}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-[#5c6b7a] hover:text-[#0a192f]">
            <span className="sr-only">Notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[#dde5ee]" aria-hidden="true" />
          <div className="flex items-center gap-x-4">
             <span className="text-sm font-medium leading-6 text-[#0a192f]">Admin</span>
             <UserCircle className="h-8 w-8 text-[#5c6b7a]" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen w-full bg-white text-[#0a192f]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col relative w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
