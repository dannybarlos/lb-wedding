import Link from "next/link";
import { SITE_CONFIG } from "@/config/site.config";

const FADE_GRADIENTS: Record<string, string> = {
  soft:   "radial-gradient(ellipse 95% 90% at 50% 50%, black 70%, transparent 100%)",
  medium: "radial-gradient(ellipse 88% 80% at 50% 50%, black 55%, transparent 100%)",
  hard:   "radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 100%)",
};

export default function Venue() {
  const { venue } = SITE_CONFIG.wedding;
  const gradient = FADE_GRADIENTS[venue.fadeIntensity] ?? FADE_GRADIENTS.medium;

  return (
    <section
      className="py-24 px-4 text-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        className="mx-auto mb-8 max-w-2xl"
        style={{ maskImage: gradient, WebkitMaskImage: gradient }}
      >
        {venue.illustrationSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={venue.illustrationSrc}
            alt={venue.name}
            className="w-full h-auto object-cover rounded"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-64 rounded" style={{ backgroundColor: "#d4c9b0" }} />
        )}
      </div>

      <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
        {venue.name}
      </h2>

      <p className="text-sm tracking-widest uppercase text-neutral-500 mb-6">
        {venue.address}
      </p>

      <Link
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-neutral-600 hover:text-black underline underline-offset-4 transition-colors"
      >
        View on Maps →
      </Link>
    </section>
  );
}
