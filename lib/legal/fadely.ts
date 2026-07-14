import type { LegalDocument } from "@/lib/legal/types";

export const fadelyPrivacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  eyebrow: "Fadely legal",
  summary:
    "How Fadely handles information submitted through this website and during custom-app enquiries and client relationships.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    'Fadely is a business name operated by Borko Petrevski in Prilep, North Macedonia, pending formal company registration. In this policy, "Fadely", "we", "us", and "our" refer to Borko Petrevski trading as Fadely.',
    "Fadely is responsible for personal data used to operate fadely.app, answer business enquiries, manage its own client relationships, and operate any Fadely-controlled application identified in an app-specific privacy policy. Each custom application has its own policy explaining whether Fadely or the relevant venue controls particular customer and appointment data.",
  ],
  sections: [
    {
      heading: "1. Scope",
      paragraphs: [
        "This policy applies to fadely.app, its contact form, communications with Fadely, proposals and client onboarding, and any Fadely account or service that links to this policy. It does not replace the app-specific privacy policy of a custom-branded mobile application or another documented service arrangement.",
      ],
    },
    {
      heading: "2. Information we collect",
      bullets: [
        "Enquiry and contact data: your name, email address, message, barbershop or business details, project requirements, and later correspondence.",
        "Client and business data: contact details, project documentation, proposals, contracts, support requests, invoices, and records needed to deliver and administer agreed services.",
        "Account data, where a Fadely service requires sign-in: your email address, authentication records, assigned role, and information you choose to add to the service.",
        "Technical data: IP address, browser and device information, visited pages, request logs, security events, and aggregated website performance or usage measurements processed by our hosting and analytics providers.",
      ],
    },
    {
      heading: "3. How we use information",
      bullets: [
        "To answer enquiries, understand project requirements, prepare proposals, and take steps requested before entering a contract.",
        "To provide, secure, support, maintain, and administer contracted custom-app and related services.",
        "To operate and improve the website, diagnose failures, prevent misuse, and protect Fadely, its clients, and service users. We rely on our legitimate interests where they do not override your rights.",
        "To maintain business, accounting, security, and legal records where required by law or reasonably necessary to establish or defend legal claims.",
        "Where we ask for consent, you may withdraw it at any time without affecting processing already carried out lawfully.",
      ],
    },
    {
      heading: "4. Service providers and sharing",
      paragraphs: [
        "We do not sell personal data or use it for third-party behavioral advertising. We share information only as needed for the purposes described here.",
      ],
      bullets: [
        "Formspree processes contact-form and deletion-request submissions on our behalf.",
        "Vercel hosts fadely.app and provides website analytics and performance monitoring.",
        "Selected email, cloud, authentication, development, and storage providers may process limited information needed to deliver Fadely services.",
        "Professional advisers, public authorities, courts, or a successor operator may receive information where required by law or reasonably necessary to protect rights, resolve a claim, or complete a business transfer.",
      ],
    },
    {
      heading: "5. International processing",
      paragraphs: [
        "Some providers may process information outside North Macedonia or the European Economic Area. Where applicable law requires it, we rely on contractual or other lawful safeguards intended to protect personal data during those transfers.",
      ],
    },
    {
      heading: "6. Retention",
      bullets: [
        "General enquiries that do not become client relationships are normally reviewed for deletion after 24 months from the last meaningful contact.",
        "Client, contract, invoice, support, and project records are kept for the relationship and afterward for the period required by applicable accounting, tax, limitation, or other legal obligations.",
        "Account and service data are retained while needed to provide the service and then deleted or anonymized, subject to backups, security needs, and lawful recordkeeping.",
        "Technical and security records are kept only as long as reasonably needed for reliability, fraud prevention, troubleshooting, and legal compliance, taking provider retention periods into account.",
      ],
    },
    {
      heading: "7. Security",
      paragraphs: [
        "We use access controls, encrypted network connections, authentication controls, restricted service access, backups, and provider security measures appropriate to the nature of the information. No online service can guarantee absolute security, so please do not send passwords, one-time codes, or unnecessary sensitive information through the contact form.",
      ],
    },
    {
      heading: "8. Your rights",
      paragraphs: [
        "Depending on applicable law, including the Law on Personal Data Protection of the Republic of North Macedonia and, where applicable, the GDPR, you may request access, correction, deletion, restriction, or a copy of your personal data, object to certain processing, or withdraw consent. We may request reasonable information to verify your identity before acting on a request.",
      ],
    },
    {
      heading: "9. Children and changes",
      paragraphs: [
        "Fadely's website and business services are not directed to children. We may update this policy when our services, providers, or legal obligations change. We will revise the date above and provide additional notice where a change materially affects your rights.",
      ],
    },
  ],
  contact: {
    heading: "10. Contact and complaints",
    text: "For privacy questions or requests, contact Fadely, operated by Borko Petrevski, Prilep, North Macedonia. You may also complain to the Agency for Personal Data Protection or another competent supervisory authority.",
    email: "hello@digilence.io",
    authority: {
      label: "Agency for Personal Data Protection",
      href: "https://azlp.mk/",
    },
  },
};

export const fadelyTerms: LegalDocument = {
  title: "Terms of Service",
  eyebrow: "Fadely legal",
  summary:
    "The terms that govern use of fadely.app and preliminary interactions with Fadely's custom-app services.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    'Fadely is a business name operated by Borko Petrevski in Prilep, North Macedonia, pending formal company registration. These Terms of Service ("Terms") govern your use of fadely.app and your preliminary interactions with Fadely.',
    "An accepted proposal, order form, email or message instruction, development or maintenance agreement, or another documented arrangement may govern delivery of a custom application. If an app-specific or project-specific arrangement conflicts with these public website Terms, that documented arrangement controls for the project.",
  ],
  sections: [
    {
      heading: "1. Website and services",
      paragraphs: [
        "Fadely designs, develops, licenses, hosts, and supports custom-branded applications and related management tools for barbershops. Website descriptions, examples, availability, and prices are general information and invitations to discuss a project; they are not a binding offer or promise to deliver a particular scope or launch date.",
      ],
    },
    {
      heading: "2. Enquiries and client arrangements",
      bullets: [
        "You must provide accurate contact and project information and have authority to act for any business you represent.",
        "A project may begin after the client accepts a proposal or instructs Fadely to proceed through email, messages, an order form, or another durable record. The documented arrangement should identify the agreed scope, fees, responsibilities, timeline, intellectual-property treatment, data-protection roles, and ongoing hosting or support.",
        "Unless an app-specific or project-specific arrangement says otherwise, recurring website prices exclude third-party charges, taxes, app-store fees, custom work outside the agreed scope, and other separately identified costs.",
      ],
    },
    {
      heading: "3. Acceptable use",
      bullets: [
        "Do not misuse the website, submit unlawful or misleading material, impersonate another person, or interfere with its operation or security.",
        "Do not probe, scrape, reverse engineer, introduce malicious code, bypass access controls, or attempt unauthorized access except where applicable law expressly permits it.",
        "Do not submit passwords, verification codes, highly sensitive information, or confidential client data through the public contact form.",
      ],
    },
    {
      heading: "4. Intellectual property",
      paragraphs: [
        "Borko Petrevski, operating as Fadely, retains ownership of fadely.app, the Fadely brand, reusable software, libraries, tools, designs, know-how, and other pre-existing or generally applicable technology. Clients retain their own branding, business content, and materials. Ownership and license rights for project-specific deliverables are determined by the applicable app-specific terms or documented project arrangement.",
        "These Terms give you a limited, revocable, non-transferable right to use the public website for its intended informational and business-enquiry purposes. They do not transfer any software, trademark, design, or other intellectual-property right.",
      ],
    },
    {
      heading: "5. Third-party services and links",
      paragraphs: [
        "The website and Fadely projects may rely on third-party hosting, communications, authentication, analytics, storage, app-store, and infrastructure providers. Their own terms may apply where you interact directly with them. Fadely is not responsible for third-party websites or services it does not control, subject to rights that cannot legally be excluded.",
      ],
    },
    {
      heading: "6. Availability and disclaimers",
      paragraphs: [
        "We may maintain, change, suspend, or discontinue the public website or a feature. We take reasonable care with website information but do not promise that it will always be complete, current, uninterrupted, secure, or error-free. Any warranty or service level for a client project must be stated in the applicable app-specific terms or documented project arrangement.",
        "Client barbershops, not Fadely, provide barbering services, set their prices and venue policies, and are responsible for in-person services. Responsibility for operation of a custom app and its data is described in that app's specific privacy policy and terms.",
      ],
    },
    {
      heading: "7. Liability",
      paragraphs: [
        "To the maximum extent permitted by law, Fadely and Borko Petrevski are not liable under these public website Terms for indirect or unforeseeable loss, lost profits, lost opportunities, or losses caused by inaccurate information you provide, third-party services outside our reasonable control, or events outside our reasonable control.",
        "Nothing in these Terms excludes liability for fraud, intent, gross negligence, death or personal injury caused by negligence, or any consumer right or liability that cannot legally be excluded or limited. Liability relating to a custom-app project is governed by its app-specific terms or documented project arrangement.",
      ],
    },
    {
      heading: "8. Changes and governing law",
      paragraphs: [
        "We may update these Terms when the website, services, or legal requirements change. The updated date will be shown above. These Terms are governed by the laws of the Republic of North Macedonia, and disputes will be heard by the competent courts in North Macedonia unless mandatory law provides otherwise.",
      ],
    },
  ],
  contact: {
    heading: "9. Contact",
    text: "Questions about these Terms or Fadely's services can be sent to Fadely, operated by Borko Petrevski, Prilep, North Macedonia.",
    email: "hello@digilence.io",
  },
};
