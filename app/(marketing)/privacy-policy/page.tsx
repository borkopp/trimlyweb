import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { fadelyPrivacyPolicy } from "@/lib/legal/fadely";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Fadely handles website, enquiry, and custom-app client information.",
  alternates: {
    canonical: "https://fadely.app/privacy-policy",
  },
  openGraph: {
    title: "Fadely Privacy Policy",
    description:
      "How Fadely handles website, enquiry, and custom-app client information.",
    url: "https://fadely.app/privacy-policy",
  },
};

export default function FadelyPrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      document={fadelyPrivacyPolicy}
      relatedDocument={{
        href: "/terms",
        label: "Read the Terms of Service",
      }}
    />
  );
}
