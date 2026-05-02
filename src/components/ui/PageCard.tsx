import Link from "next/link";
import { type ReactNode } from "react";

interface PageCardProps {
  title: string;
  body: string;
  link?: { label: string; href: string; isExternal: boolean };
  icon?: ReactNode;
}

export default function PageCard({ title, body, link, icon }: PageCardProps) {
  return (
    <div className="bg-white/60 border border-neutral-200 rounded-2xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {icon && <div className="text-neutral-400">{icon}</div>}
      <h3 className="font-serif text-xl font-bold">{title}</h3>
      <p className="text-neutral-600 leading-relaxed flex-1">{body}</p>
      {link && (
        link.isExternal ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-5 py-2 rounded-full border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors text-center"
          >
            {link.label} →
          </a>
        ) : (
          <Link
            href={link.href}
            className="inline-block mt-2 px-5 py-2 rounded-full border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors text-center"
          >
            {link.label} →
          </Link>
        )
      )}
    </div>
  );
}
