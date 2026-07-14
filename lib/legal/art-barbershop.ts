import type { LegalDocument } from "@/lib/legal/types";

export const artBarbershopPrivacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  eyebrow: "ART Barbershop app legal",
  summary:
    "How personal data is handled in the ART Barbershop mobile booking application.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    'ART Barbershop ("ART", "we", "us", or "our") operates the barbershop and determines why customer, booking, staff, and shop information is used. ART is the controller of that personal data.',
    "Fadely developed, licenses, hosts, and maintains the ART Barbershop application for ART. Fadely is a business name operated by Borko Petrevski in Prilep, North Macedonia, pending formal company registration. Borko Petrevski is the developer identified for the application, and Fadely normally processes app data on ART's instructions as its technology provider.",
  ],
  sections: [
    {
      heading: "1. Scope and responsibilities",
      paragraphs: [
        "This policy applies when you create or use an account, view services and availability, book or manage appointments, upload an image, submit a rating, receive notifications, contact support, or use authorized staff tools in the ART Barbershop app.",
        "ART controls the customer relationship, appointment purposes, barber services, staff access, and shop records. Fadely provides and secures the technology under ART's instructions. Where Fadely must use limited business, support, or security records for its own legal obligations or to establish or defend a claim, it is responsible for that limited use.",
      ],
    },
    {
      heading: "2. Data handled by the app",
      bullets: [
        "Account and contact data: your name, verified phone number, account role, verification time, and any email address or profile image you choose to provide.",
        "Booking data: selected barber and services, appointment date and time, displayed price and duration, status, booking or cancellation notes, and rescheduling information.",
        "Staff and shop data: barber profiles, service assignments, working hours, breaks, time off, schedules, shop content, and operational appointment analytics.",
        "User content: profile or service images uploaded by authorized users and ratings associated with completed appointments.",
        "Notification and technical data: notification preferences, Expo push tokens, authentication sessions, SMS verification events, security and rate-limit records, IP or request information, device or app version information, and diagnostic records needed to operate and secure the service.",
        "Local device data: language preferences and authentication or notification credentials stored on your device. The app does not receive your address book, microphone recordings, camera feed, or precise device location unless a future feature clearly requests that access and this policy is updated.",
      ],
    },
    {
      heading: "3. Why data is used",
      bullets: [
        "To verify accounts, provide available appointment times, create and manage bookings, show appointment history, and provide owner and staff tools. This supports the service you request and ART's agreement with you.",
        "To send verification messages and, with device permission, appointment confirmations, reminders, changes, and cancellations.",
        "To prevent abuse, protect accounts, troubleshoot problems, maintain reliable operations, and improve shop and app functionality based on legitimate operational and security interests.",
        "To meet accounting, tax, consumer-protection, data-protection, or other legal obligations and to establish or defend legal claims.",
        "Where processing relies on consent, you may withdraw it at any time without affecting earlier lawful processing.",
      ],
    },
    {
      heading: "4. Access, service providers, and sharing",
      paragraphs: [
        "Authorized ART owners and barbers can see the client and appointment details reasonably needed to provide and manage services. ART and Fadely do not sell app personal data or use it for third-party behavioral advertising.",
      ],
      bullets: [
        "Fadely, operated by Borko Petrevski, provides the licensed application, technical support, maintenance, and infrastructure management for ART.",
        "Convex provides backend, database, authentication infrastructure, and scheduled processing.",
        "Twilio sends and verifies one-time SMS codes using the phone number and verification request needed for that purpose.",
        "Expo provides push-notification delivery using device push tokens and related delivery information.",
        "An S3-compatible object-storage provider stores uploaded profile and service images.",
        "Formspree processes requests submitted through the public account-deletion form.",
        "Professional advisers, authorities, courts, or a successor operator may receive limited data where legally required or reasonably necessary to protect rights, resolve a claim, or complete a lawful business transfer.",
      ],
    },
    {
      heading: "5. Retention and account deletion",
      bullets: [
        "Account and profile information is kept while the account is active and is then deleted or anonymized after a verified deletion request, normally within 30 days, unless limited retention is legally required.",
        "Appointment and operational records are kept as long as reasonably needed to provide services, resolve disputes, prevent abuse, and satisfy ART's accounting, tax, consumer, or other recordkeeping duties. Direct identifiers are removed or anonymized when they are no longer needed where feasible.",
        "Push tokens, uploaded images, and other account-linked information are deleted or made inaccessible through the applicable deletion process, subject to limited backups and lawful retention.",
        "Security, verification, and rate-limit records are retained only for the period reasonably needed to secure the service or meet legal obligations.",
      ],
      paragraphs: [
        "You may request deletion through the ART Barbershop account-deletion page or by emailing the address below. We may verify your identity before completing a request and will explain if a limited record must be retained.",
      ],
    },
    {
      heading: "6. Visibility and international processing",
      paragraphs: [
        "Barber profiles, service details, images, prices, availability, and aggregated ratings may be visible to app users. Client contact details and booking notes are not public but are visible to authorized ART staff managing the appointment.",
        "Some providers may process information outside North Macedonia or the European Economic Area. Where applicable law requires it, ART and Fadely rely on contractual or other lawful safeguards intended to protect personal data during those transfers.",
      ],
    },
    {
      heading: "7. Security",
      paragraphs: [
        "The service uses access controls, verified phone authentication, encrypted network connections, restricted backend functions, short-lived signed upload links, backups, and provider security controls. No system can guarantee absolute security. Protect access to your phone and verification codes and report suspected misuse promptly.",
      ],
    },
    {
      heading: "8. Your choices and rights",
      paragraphs: [
        "Depending on applicable law, including the Law on Personal Data Protection of the Republic of North Macedonia and, where applicable, the GDPR, you may request access, correction, deletion, restriction, or a copy of your data, object to certain processing, withdraw consent, or complain to a competent supervisory authority.",
      ],
      bullets: [
        "Edit available profile information in the app.",
        "Change reminder preferences or disable push notifications in the app and device settings.",
        "Use the public account-deletion page or email us to request account and associated data deletion.",
        "Email us to exercise another privacy right. Reasonable identity verification may be required.",
      ],
    },
    {
      heading: "9. Children and policy changes",
      paragraphs: [
        "The app is not directed to children under 16. A person under 16 should use it only with authorization and supervision from a parent or legal guardian. The service does not make decisions producing legal or similarly significant effects based solely on automated processing.",
        "This policy may be updated when the app, providers, or legal requirements change. The date above will be revised and additional notice will be provided where a change materially affects your rights or how data is used.",
      ],
    },
  ],
  contact: {
    heading: "10. Contact and complaints",
    text: "Privacy requests for the ART Barbershop app may be sent to ART through its technology provider, Fadely, operated by Borko Petrevski in Prilep, North Macedonia. Fadely will support ART in verifying and responding to the request. You may also complain to the Agency for Personal Data Protection or another competent supervisory authority.",
    email: "hello@digilence.io",
    authority: {
      label: "Agency for Personal Data Protection",
      href: "https://azlp.mk/",
    },
  },
};

export const artBarbershopTerms: LegalDocument = {
  title: "Terms of Service",
  eyebrow: "ART Barbershop app legal",
  summary:
    "The terms that govern use of the ART Barbershop mobile booking application.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    'These Terms of Service ("Terms") govern your use of the ART Barbershop application and booking service. Your appointment and barbering-service agreement is with ART Barbershop. By creating an account, booking an appointment, or using the app, you agree to these Terms.',
    "Fadely, operated by Borko Petrevski in Prilep, North Macedonia pending formal company registration, developed and licenses the app technology to ART. Fadely does not provide barbering services and is not the barbershop responsible for carrying out appointments.",
  ],
  sections: [
    {
      heading: "1. The service",
      paragraphs: [
        "The app lets users view ART's shop information, services, barbers, prices, and availability; book, review, reschedule, or cancel appointments; receive service messages; and manage account preferences. Authorized ART staff may use additional tools for schedules, services, appointments, and shop operations.",
      ],
    },
    {
      heading: "2. Eligibility and accounts",
      bullets: [
        "You must be at least 16 or use the service with permission and supervision from a parent or legal guardian.",
        "You must provide accurate information, use a phone number you are authorized to access, and keep your device and verification codes secure.",
        "You are responsible for activity through your account and should report suspected unauthorized access promptly.",
        "Owner and staff functions may be used only by people authorized by ART. You must not attempt to obtain or use a role that was not assigned to you.",
      ],
    },
    {
      heading: "3. Appointments, prices, and payment",
      paragraphs: [
        "An appointment is accepted when it appears as confirmed or upcoming in the app. Availability can change before booking is completed. Check the service, barber, date, time, duration, and price before confirming.",
        "Displayed prices are in Macedonian denars (MKD) unless stated otherwise. The app does not currently process payments; payment is made directly to ART unless ART clearly states otherwise. ART is responsible for its services, prices, receipts, and applicable consumer obligations.",
      ],
    },
    {
      heading: "4. Changes, cancellations, and no-shows",
      paragraphs: [
        "Use the available app controls or contact ART as soon as possible to change or cancel an appointment. ART may change or cancel an appointment because of staff absence, schedule changes, safety concerns, errors, events outside reasonable control, or another legitimate operational reason and will try to provide reasonable notice.",
        "Repeated abusive bookings or no-shows may lead to booking restrictions or account suspension. A cancellation fee or special shop policy applies only if ART disclosed it before booking or separately agreed it with you and it is lawful.",
      ],
    },
    {
      heading: "5. Communications and your content",
      paragraphs: [
        "SMS is used for phone verification and may be subject to normal mobile-provider charges. Optional push notifications may include confirmations, reminders, changes, and cancellations. You can disable push notifications, but essential appointment information may still appear in the app or be communicated by another reasonable method.",
        "You keep ownership of content you own, but grant ART and its technology provider a non-exclusive, worldwide, royalty-free license to host, copy, display, and process it only as needed to provide, secure, and support the service. You must have the right to submit that content, and it must not be unlawful, abusive, misleading, infringing, malicious, or improperly disclose another person's information.",
      ],
    },
    {
      heading: "6. Acceptable use",
      bullets: [
        "Do not impersonate another person, submit false bookings, harass staff or clients, or use the service for unlawful activity.",
        "Do not probe, disrupt, overload, scrape, reverse engineer, bypass access controls, introduce malicious code, or attempt unauthorized access except where applicable law expressly permits it.",
        "Do not copy or commercially exploit the application, branding, listings, or content without permission or another lawful basis.",
      ],
    },
    {
      heading: "7. Privacy and third-party services",
      paragraphs: [
        "The ART Barbershop Privacy Policy explains how personal data is handled and forms part of these Terms. The app relies on Fadely and selected third-party hosting, authentication, SMS, notification, storage, and app-store services. Their terms may apply where you interact with them directly.",
      ],
    },
    {
      heading: "8. Ownership and license",
      paragraphs: [
        "ART owns its name, branding, shop content, service information, and customer relationship. Borko Petrevski, operating as Fadely, owns and licenses the application software, design system, reusable components, tools, and underlying technology, except where a written agreement states otherwise. Other provider materials remain owned by their respective owners.",
        "You receive a limited, personal, revocable, non-exclusive, non-transferable right to use the app for its intended purpose while these Terms apply. No source code, trademark, design, or other intellectual-property ownership is transferred to you.",
      ],
    },
    {
      heading: "9. Availability and responsibility",
      paragraphs: [
        "ART and Fadely may maintain, change, suspend, or discontinue all or part of the app. Uninterrupted or error-free availability is not promised, but this does not affect obligations that cannot legally be excluded.",
        "ART, not Fadely, performs barbering services and is responsible for appointment performance, shop policies, and in-person services. Tell the barber about relevant allergies, sensitivities, health conditions, or preferences before a service.",
      ],
    },
    {
      heading: "10. Liability",
      paragraphs: [
        "To the maximum extent permitted by law, ART, Fadely, and Borko Petrevski are not liable for indirect or unforeseeable loss, loss caused by inaccurate information you provide, third-party services outside reasonable control, or events outside reasonable control. Fadely and Borko Petrevski are not liable for the performance or result of barbering services provided by ART.",
        "Nothing in these Terms excludes liability for fraud, intent, gross negligence, death or personal injury caused by negligence, or a consumer right or liability that cannot legally be excluded or limited.",
      ],
    },
    {
      heading: "11. Suspension, deletion, and changes",
      paragraphs: [
        "You may stop using the service or request account deletion through the public account-deletion page. ART or Fadely may restrict or suspend access where reasonably necessary to protect users or the service, investigate misuse, comply with law, or address a material breach.",
        "These Terms may be updated to reflect service or legal changes. The date above will be revised, and reasonable notice will be provided for material changes where required. Provisions that should logically continue after termination—including ownership, lawful retention, disclaimers, liability limits, and dispute terms—remain effective.",
      ],
    },
    {
      heading: "12. Governing law and disputes",
      paragraphs: [
        "These Terms are governed by the laws of the Republic of North Macedonia. Competent courts in North Macedonia will hear disputes unless mandatory consumer law gives you the right to use another court or law. Contact us first so the concern can be reviewed informally.",
      ],
    },
  ],
  contact: {
    heading: "13. Contact",
    text: "Questions about the app or these Terms may be sent to ART through Fadely, operated by Borko Petrevski, Prilep, North Macedonia. Questions about appointments or barbering services remain ART's responsibility.",
    email: "hello@digilence.io",
  },
};

export const artBarbershopAccountDeletion: LegalDocument = {
  title: "Account Deletion",
  eyebrow: "ART Barbershop privacy choices",
  summary:
    "Request permanent deletion of an ART Barbershop app account and associated personal data.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    "This page applies to accounts created in the ART Barbershop mobile application. ART is responsible for the customer and appointment records, and Fadely processes the request as ART's technology provider.",
    "Submit the form below using the phone number connected to your account. We will use your contact email to verify the request and keep you informed. Never send a password or SMS verification code.",
  ],
  sections: [
    {
      heading: "1. How deletion works",
      bullets: [
        "Submit the deletion request form below or email hello@digilence.io with the subject “ART Barbershop account deletion”.",
        "We will verify that you control the account, which may require a response from the account phone number or other reasonable confirmation.",
        "Verified requests are normally completed within 30 days. You will be told if more time is legally permitted and required.",
      ],
    },
    {
      heading: "2. Data deleted or anonymized",
      bullets: [
        "Your account profile, authentication association, contact details, preferences, and active push-notification token.",
        "Profile images and other account content that is no longer required for the service.",
        "Ratings, appointment notes, and other account-linked records are deleted or anonymized where they do not need to be retained lawfully.",
      ],
    },
    {
      heading: "3. Limited records that may remain",
      paragraphs: [
        "ART may retain limited appointment, transaction, fraud-prevention, security, or legal records where required by law or reasonably necessary to resolve disputes and establish or defend claims. Those records will be restricted, kept only for the required period, and not used to keep the deleted account active. Temporary backup copies may remain until the relevant backup cycle expires.",
      ],
    },
  ],
  contact: {
    heading: "4. Need help?",
    text: "Contact ART through Fadely, operated by Borko Petrevski in Prilep, North Macedonia, if you cannot submit the form or have a question about deletion.",
    email: "hello@digilence.io",
  },
};
