import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";
import PageCard from "@/components/ui/PageCard";

export const dynamic = "force-static";

export default function TravelPage() {
  if (!FLAGS.travelVisible) redirect("/");

  const { travel } = SITE_CONFIG;

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 max-w-4xl mx-auto">
      <h1 className="font-serif text-4xl md:text-6xl font-bold mb-16 text-center">
        {travel.heading}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {travel.sections.map((section) => (
          <PageCard
            key={section.id}
            title={section.title}
            body={section.body}
            link={
              "link" in section
                ? { ...section.link, isExternal: true }
                : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}
