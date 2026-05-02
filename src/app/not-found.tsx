import Link from "next/link";
import { SITE_CONFIG } from "@/config/site.config";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-serif italic text-neutral-500 mb-2">
        oops — nothing here
      </p>
      <h1 className="font-serif text-6xl font-bold mb-6">
        {SITE_CONFIG.couple.monogram}
      </h1>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition-colors"
      >
        Back to the wedding
      </Link>
    </main>
  );
}
