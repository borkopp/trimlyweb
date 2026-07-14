import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { artBarbershopPrivacyPolicy } from "@/lib/legal/art-barbershop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART Barbershop Privacy Policy",
  description:
    "Privacy Policy for the ART Barbershop mobile application and booking service.",
  alternates: {
    canonical: "https://fadely.app/apps/art-barbershop/privacy-policy",
  },
  openGraph: {
    title: "ART Barbershop Privacy Policy",
    description:
      "How personal data is handled in the ART Barbershop mobile application.",
    url: "https://fadely.app/apps/art-barbershop/privacy-policy",
  },
};

export default function ArtBarbershopPrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      additionalDocuments={[
        {
          href: "/apps/art-barbershop/account-deletion",
          label: "Delete an account",
        },
      ]}
      document={artBarbershopPrivacyPolicy}
      relatedDocument={{
        href: "/apps/art-barbershop/terms",
        label: "Read the Terms of Service",
      }}
    />
  );
}
