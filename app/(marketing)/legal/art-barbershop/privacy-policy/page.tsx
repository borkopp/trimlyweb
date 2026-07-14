import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { artBarbershopPrivacyPolicy } from "@/lib/legal/art-barbershop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART Barbershop Privacy Policy",
  description:
    "Privacy Policy for the ART Barbershop mobile application and appointment-booking service.",
  alternates: {
    canonical: "https://fadely.app/legal/art-barbershop/privacy-policy",
  },
  openGraph: {
    title: "ART Barbershop Privacy Policy",
    description:
      "How ART Barbershop handles personal data in its mobile booking application.",
    url: "https://fadely.app/legal/art-barbershop/privacy-policy",
  },
};

export default function ArtBarbershopPrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      document={artBarbershopPrivacyPolicy}
      relatedDocument={{
        href: "/legal/art-barbershop/terms-of-service",
        label: "Read the Terms of Service",
      }}
    />
  );
}
