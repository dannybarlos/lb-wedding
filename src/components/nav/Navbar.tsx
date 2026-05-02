"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";

export default function Navbar() {
  const { scrolled } = useScrollNavbar();
  const [menuOpen, setMenuOpen] = useState(false);
  const { nav, couple } = SITE_CONFIG;

  return (
    <header
      data-scrolled={scrolled}
      className={[
        "fixed top-0 w-full z-50 flex items-center justify-between px-8 py-3 transition-all duration-300",
        scrolled ? "bg-[#f5f0e3]/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      ].join(" ")}
    >
      <Link href="/" className="font-serif text-xl tracking-tight select-none">
        {couple.monogram}
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {nav.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-neutral-600 hover:text-black transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:block">
        {FLAGS.rsvpOpen && (
          <Link
            href={nav.rsvpHref}
            className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition-colors"
          >
            {nav.rsvpLabel}
          </Link>
        )}
      </div>

      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f5f0e3] shadow-md flex flex-col items-center gap-4 py-6 md:hidden">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {FLAGS.rsvpOpen && (
            <Link
              href={nav.rsvpHref}
              className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {nav.rsvpLabel}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
