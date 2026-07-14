import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { artBarbershopTerms } from "@/lib/legal/art-barbershop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART Barbershop Terms of Service",
  description:
    "Terms governing use of the ART Barbershop mobile booking application.",
  alternates: {
    canonical: "https://fadely.app/apps/art-barbershop/terms",
  },
  openGraph: {
    title: "ART Barbershop Terms of Service",
    description:
      "Terms governing use of the ART Barbershop mobile booking application.",
    url: "https://fadely.app/apps/art-barbershop/terms",
  },
};

export default function ArtBarbershopTermsPage() {
  return (
    <LegalDocumentPage
      document={artBarbershopTerms}
      relatedDocument={{
        href: "/apps/art-barbershop/privacy-policy",
        label: "Read the Privacy Policy",
      }}
    />
  );
}
