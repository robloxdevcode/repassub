import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, webPageJsonLd } from "@/lib/seo";
import { getUseCasePage, USE_CASE_PAGES } from "@/lib/use-cases-content";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import { JsonLd } from "@/components/marketing/json-ld";
import { SeoBreadcrumbs } from "@/components/marketing/seo-breadcrumbs";
import { SeoInternalLinks } from "@/components/marketing/seo-internal-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return USE_CASE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getUseCasePage(slug);
  if (!page) return { title: "Not found" };
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/use-cases/${slug}`,
    keywords: page.keywords,
  });
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getUseCasePage(slug);
  if (!page) notFound();

  const path = `/use-cases/${slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <JsonLd
        data={[
          webPageJsonLd({ name: page.title, description: page.description, path }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Use cases", path: "/use-cases" },
            { name: page.title, path },
          ]),
        ]}
      />

      <SeoBreadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Use cases", path: "/use-cases" },
          { name: page.title, path },
        ]}
      />

      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Use case</p>
      <h1 className="text-3xl md:text-4xl font-bold text-retro-text mb-4">{page.headline}</h1>
      <p className="text-lg text-retro-text-dim leading-relaxed mb-10">{page.description}</p>

      <section className="retro-panel p-6 mb-8">
        <h2 className="font-bold mb-4">How to set it up</h2>
        <ol className="space-y-3">
          {page.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-retro-text-dim">
              <span className="font-bold text-retro-accent shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="font-bold mb-3">Example fan steps</h2>
        <div className="flex flex-wrap gap-2">
          {page.exampleSteps.map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-retro-surface-2 border border-retro-border"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <MarketingAuthLink href="/sign-up">
        <RetroButton size="lg">{page.cta}</RetroButton>
      </MarketingAuthLink>
      <p className="mt-4 text-sm text-retro-text-muted">
        Free unlimited links ·{" "}
        <Link href="/help" className="text-retro-accent hover:underline">
          Help & FAQ
        </Link>
      </p>

      <SeoInternalLinks />
    </div>
  );
}
