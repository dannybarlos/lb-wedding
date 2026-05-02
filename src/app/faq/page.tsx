"use client";

import { ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { SITE_CONFIG } from "@/config/site.config";

export const dynamic = "force-static";

export default function FAQPage() {
  const { faq } = SITE_CONFIG;
  const items = faq.items as readonly { q: string; a: string }[];

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-2xl mx-auto">
      <h1 className="font-serif text-4xl md:text-6xl font-bold mb-16 text-center">
        {faq.heading}
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-neutral-500">No questions yet — check back soon!</p>
      ) : (
        <Accordion.Root type="single" collapsible className="divide-y divide-neutral-200">
          {items.map((item, i) => (
            <Accordion.Item key={i} value={`item-${i}`}>
              <Accordion.Trigger className="flex w-full items-center justify-between py-5 text-left font-medium hover:text-neutral-600 transition-colors group">
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className="shrink-0 ml-4 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <p className="pb-5 text-neutral-600 leading-relaxed">{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </main>
  );
}
