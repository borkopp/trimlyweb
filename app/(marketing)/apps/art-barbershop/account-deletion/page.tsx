import { AccountDeletionForm } from "@/components/legal/account-deletion-form";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { artBarbershopAccountDeletion } from "@/lib/legal/art-barbershop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART Barbershop Account Deletion",
  description:
    "Request deletion of an ART Barbershop app account and associated personal data.",
  alternates: {
    canonical: "https://fadely.app/apps/art-barbershop/account-deletion",
  },
  openGraph: {
    title: "ART Barbershop Account Deletion",
    description:
      "Request deletion of an ART Barbershop app account and associated personal data.",
    url: "https://fadely.app/apps/art-barbershop/account-deletion",
  },
};

export default function ArtBarbershopAccountDeletionPage() {
  return (
    <LegalDocumentPage
      document={artBarbershopAccountDeletion}
      relatedDocument={{
        href: "/apps/art-barbershop/privacy-policy",
        label: "Read the Privacy Policy",
      }}
    >
      <AccountDeletionForm />
    </LegalDocumentPage>
  );
}
