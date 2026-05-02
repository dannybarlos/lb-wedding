import { redirect } from "next/navigation";
import { Gift, Package, Plane, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";

export const dynamic = "force-static";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  gift:    Gift,
  package: Package,
  plane:   Plane,
};

function getIcon(key: string) {
  const Icon = ICON_MAP[key] ?? ExternalLink;
  return <Icon size={20} />;
}

export default function RegistryPage() {
  if (!FLAGS.registryVisible) redirect("/");

  const { registry } = SITE_CONFIG;

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
          {registry.heading}
        </h1>
        <p className="text-neutral-500 mb-12 text-lg leading-relaxed">
          {registry.subheading}
        </p>

        <div className="flex flex-col gap-4">
          {registry.links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-neutral-300 hover:bg-black hover:text-white hover:border-black transition-all group w-full text-left"
            >
              <span className="text-neutral-400 group-hover:text-white transition-colors">
                {getIcon(item.icon)}
              </span>
              <span className="flex-1 text-center font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
