import Image from "next/image";
import Link from "next/link";

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-5">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-manara-horizontal.png"
              alt="Manara Network"
              width={180}
              height={44}
              className="h-8 w-auto opacity-90"
            />
          </Link>
          <div className="max-w-md space-y-3 text-sm text-[#5c6b7a]">
            <address className="not-italic leading-relaxed text-[#0a192f]/85">
              Centre Commercial Mohammedia Mall, 4<sup>e</sup> étage, 1163,
              Bureau 23
            </address>
            <p>
              <a
                href="tel:+21323804103"
                className="font-medium text-[#0a192f] underline-offset-4 hover:underline"
              >
                00 213 (0) 23 80 41 03
              </a>
            </p>
          </div>
        </div>
        <Link
          href="https://www.linkedin.com/company/manara-network"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0a192f]/75 transition-colors hover:text-[#0a192f]"
        >
          <LinkedInGlyph className="size-5 shrink-0" />
          LinkedIn
        </Link>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-[var(--brand-border)] pt-8 text-center text-xs text-[#5c6b7a]">
        © {new Date().getFullYear()} Manara Network — www.manara.network
      </p>
    </footer>
  );
}
