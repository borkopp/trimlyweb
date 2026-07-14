import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { fadelyTerms } from "@/lib/legal/fadely";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing fadely.app and preliminary interactions with Fadely's custom-app services.",
  alternates: {
    canonical: "https://fadely.app/terms",
  },
  openGraph: {
    title: "Fadely Terms of Service",
    description:
      "Terms governing fadely.app and preliminary interactions with Fadely's custom-app services.",
    url: "https://fadely.app/terms",
  },
};

export default function FadelyTermsPage() {
  return (
    <LegalDocumentPage
      document={fadelyTerms}
      relatedDocument={{
        href: "/privacy-policy",
        label: "Read the Privacy Policy",
      }}
    />
  );
}
