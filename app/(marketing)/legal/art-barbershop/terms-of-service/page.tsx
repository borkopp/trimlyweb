import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { artBarbershopTerms } from "@/lib/legal/art-barbershop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART Barbershop Terms of Service",
  description:
    "Terms of Service for the ART Barbershop mobile application and appointment-booking service.",
  alternates: {
    canonical: "https://fadely.app/legal/art-barbershop/terms-of-service",
  },
  openGraph: {
    title: "ART Barbershop Terms of Service",
    description:
      "The terms governing use of the ART Barbershop mobile booking application.",
    url: "https://fadely.app/legal/art-barbershop/terms-of-service",
  },
};

export default function ArtBarbershopTermsPage() {
  return (
    <LegalDocumentPage
      document={artBarbershopTerms}
      relatedDocument={{
        href: "/legal/art-barbershop/privacy-policy",
        label: "Read the Privacy Policy",
      }}
    />
  );
}
