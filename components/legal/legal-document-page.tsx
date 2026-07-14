import type { LegalDocument } from "@/lib/legal/types";
import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type LegalDocumentPageProps = {
  document: LegalDocument;
  relatedDocument: {
    href: string;
    label: string;
  };
  additionalDocuments?: Array<{
    href: string;
    label: string;
  }>;
  children?: ReactNode;
};

export function LegalDocumentPage({
  document,
  relatedDocument,
  additionalDocuments = [],
  children,
}: LegalDocumentPageProps) {
  return (
    <div className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),transparent_58%)]"
      />

      <article className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <header className="mx-auto flex max-w-3xl flex-col gap-5 border-b border-border pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {document.eyebrow}
          </p>
          <div className="flex flex-col gap-4">
            <h1 className="font-montserrat text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {document.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {document.summary}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{document.effectiveDate}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[relatedDocument, ...additionalDocuments].map((item) => (
                <Link
                  className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <nav
              aria-label={`${document.title} sections`}
              className="sticky top-28 flex flex-col gap-3 border-l border-border pl-5 text-sm"
            >
              <p className="mb-1 font-semibold text-foreground">On this page</p>
              {document.sections.map((section, index) => (
                <a
                  className="leading-5 text-muted-foreground transition-colors hover:text-primary"
                  href={`#section-${index + 1}`}
                  key={section.heading}
                >
                  {section.heading}
                </a>
              ))}
              <a
                className="leading-5 text-muted-foreground transition-colors hover:text-primary"
                href="#contact"
              >
                {document.contact.heading}
              </a>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-12">
            <div className="flex flex-col gap-5 text-base leading-8 text-muted-foreground">
              {document.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {document.sections.map((section, index) => (
              <section
                className="scroll-mt-28 flex flex-col gap-5"
                id={`section-${index + 1}`}
                key={section.heading}
              >
                <h2 className="font-montserrat text-2xl font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    className="text-base leading-8 text-muted-foreground"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="flex list-none flex-col gap-4">
                    {section.bullets.map((item) => (
                      <li className="flex gap-3" key={item}>
                        <span
                          aria-hidden="true"
                          className="mt-3 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span className="text-base leading-8 text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {children}

            <section
              className="scroll-mt-28 flex flex-col gap-5 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8"
              id="contact"
            >
              <h2 className="font-montserrat text-2xl font-semibold tracking-tight text-foreground">
                {document.contact.heading}
              </h2>
              <p className="text-base leading-8 text-muted-foreground">
                {document.contact.text}
              </p>
              <div className="flex flex-col items-start gap-3">
                <a
                  className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
                  href={`mailto:${document.contact.email}`}
                >
                  <Mail aria-hidden="true" />
                  {document.contact.email}
                </a>
                {document.contact.authority ? (
                  <a
                    className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                    href={document.contact.authority.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {document.contact.authority.label}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
