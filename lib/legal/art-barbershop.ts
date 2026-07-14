export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  summary: string;
  effectiveDate: string;
  introduction: string[];
  sections: LegalSection[];
  contact: {
    heading: string;
    text: string;
    email: string;
    authority?: {
      label: string;
      href: string;
    };
  };
};

export const artBarbershopPrivacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  eyebrow: "ART Barbershop legal",
  summary:
    "How ART Barbershop collects, uses, stores, and protects personal data in its mobile booking application.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    'ART Barbershop ("we", "us", or "our") operates the ART Barbershop mobile application and booking service. This Privacy Policy explains what personal data we process, why we process it, how long we keep it, and the choices and rights available to you.',
    "ART Barbershop is the controller of personal data used to provide salon and booking services. The technology providers named below process data on our behalf where necessary to operate the service.",
  ],
  sections: [
    {
      heading: "1. Scope",
      paragraphs: [
        "This policy applies when you browse the app, create or use an account, book or manage appointments, upload an image, submit a rating, receive notifications, contact support, or use staff and owner tools. It does not cover third-party websites or apps that you open from the service.",
      ],
    },
    {
      heading: "2. Data we collect",
      bullets: [
        "Account and contact data: your name, verified phone number, account role, verification time, and, if you provide them, an email address and profile photo.",
        "Booking data: selected barber and services, date and time, price and duration, appointment status, booking notes, cancellation notes, and rescheduling history reflected in the appointment record.",
        "Staff and shop data: barber profile, title, biography, service assignments, working hours, breaks, time off and optional reason, schedule changes, and operational appointment analytics.",
        "User content: profile or service images that authorized users choose to upload and ratings connected to completed appointments.",
        "Notification data: notification preferences and an Expo push token associated with the signed-in account and device.",
        "Security and technical data: authentication sessions, SMS verification events, short-lived phone-based rate-limit records, and basic request information processed by our hosting providers to keep the service reliable and secure.",
        "Local device data: your language preference and authentication or notification credentials stored securely on your device. We do not receive your address book, microphone recordings, camera feed, or precise device location.",
      ],
    },
    {
      heading: "3. How we use data and our legal bases",
      bullets: [
        "To create and secure your account, verify your phone number, provide available times, make and manage bookings, show appointment history, and provide staff tools. This is necessary to perform our service agreement or take steps you request before a booking.",
        "To send appointment confirmations, changes, cancellations, and optional reminders. Push notifications are used only after device permission is granted, and you can disable them in Settings or your device settings.",
        "To prevent misuse, protect accounts, troubleshoot problems, maintain records, and improve salon operations. We rely on our legitimate interests in operating a safe and effective booking service, balanced against your rights.",
        "To keep records or respond to authorities when required by tax, accounting, consumer-protection, data-protection, or other applicable law.",
        "Where processing depends on consent, such as optional notifications or an optional upload, you may withdraw that consent at any time. Withdrawal does not affect processing already carried out lawfully.",
      ],
    },
    {
      heading: "4. Who can see data and service providers",
      paragraphs: [
        "Authorized ART Barbershop owners and barbers can see the client and appointment details reasonably needed to provide and manage the booked service. We do not sell personal data and do not use it for third-party behavioral advertising.",
        "We use selected providers to run the service. They may process only the data needed for their role and are expected to protect it consistently with applicable law and our instructions.",
      ],
      bullets: [
        "Convex provides the application backend, database, authentication infrastructure, and scheduled jobs.",
        "Twilio sends and verifies one-time SMS codes and receives the phone number and verification request needed for that purpose.",
        "Expo provides push-notification delivery and receives device push tokens and notification delivery data.",
        "An S3-compatible object-storage provider stores uploaded profile and service images.",
        "Professional advisers, authorities, or a successor operator may receive limited data where legally required or necessary to protect rights, complete a business transfer, or resolve a claim.",
      ],
    },
    {
      heading: "5. Images and information visible to others",
      paragraphs: [
        "Barber profiles, service details, service images, prices, availability, and aggregated ratings are shown to app users. Uploaded profile and service images are stored at public object URLs so they can be displayed in the app. Do not upload confidential, unlawful, or sensitive material. Client booking notes and contact details are not public, but are visible to authorized staff who manage the appointment.",
      ],
    },
    {
      heading: "6. International processing",
      paragraphs: [
        "Some technology providers may process data outside North Macedonia or the European Economic Area. Where applicable law requires it, we use contractual or other lawful safeguards intended to protect data during these transfers. You may contact us for more information about the safeguards relevant to your data.",
      ],
    },
    {
      heading: "7. Retention and deletion",
      bullets: [
        "Account and profile data are kept while the account is active and then deleted or anonymized after a verified deletion request, normally within 30 days, unless a longer period is legally required.",
        "Appointment, transaction, and operational records are kept for as long as reasonably needed to provide the service, resolve disputes, prevent abuse, and meet accounting, tax, consumer, or other legal recordkeeping obligations. When direct identification is no longer needed, we delete or anonymize it where feasible.",
        "Push tokens are removed when you securely sign out, disable the registration, or request account deletion; invalid tokens are also removed when reported by the push provider.",
        "Phone-specific SMS rate-limit records are automatically removed after they become stale. Authentication and security records are retained only as needed to secure the service and meet legal obligations.",
        "Uploaded images are retained while used by the relevant profile or service and are deleted or made inaccessible as part of the applicable deletion process, subject to backups and legal retention needs.",
      ],
    },
    {
      heading: "8. Security",
      paragraphs: [
        "We use access controls, verified phone authentication, encrypted network connections, restricted backend functions, short-lived signed upload links, and provider security controls. No system can be guaranteed completely secure. Please protect access to your phone and tell us promptly if you believe your account has been misused.",
      ],
    },
    {
      heading: "9. Your choices and rights",
      paragraphs: [
        "Depending on applicable law, including the Law on Personal Data Protection of the Republic of North Macedonia and, where applicable, the GDPR, you may have rights to access, correct, delete, restrict, or receive a copy of your data, and to object to certain processing. You may also withdraw consent and complain to the competent data-protection authority.",
      ],
      bullets: [
        "Edit your name and profile in Settings.",
        "Change reminder preferences or disable push notifications in Settings and in device settings.",
        "Start account deletion from Settings > Delete account. We may verify your identity and will tell you if limited records must be retained by law.",
        "Email us to exercise another privacy right. We may ask for reasonable verification and will respond within the period required by applicable law.",
      ],
    },
    {
      heading: "10. Children, automated decisions, and changes",
      paragraphs: [
        "The service is not directed to children under 16. A person under 16 should use it only with authorization from a parent or legal guardian. We do not make decisions producing legal or similarly significant effects based solely on automated processing.",
        "We may update this policy when the app, our providers, or legal requirements change. We will update the date above and provide additional notice when a change materially affects your rights or how we use personal data.",
      ],
    },
  ],
  contact: {
    heading: "11. Contact and complaints",
    text: "Contact ART Barbershop with privacy questions or requests. ART Barbershop is based in the Republic of North Macedonia. You may also lodge a complaint with the Agency for Personal Data Protection or another supervisory authority competent for where you live.",
    email: "hello@digilence.io",
    authority: {
      label: "Agency for Personal Data Protection",
      href: "https://azlp.mk/",
    },
  },
};

export const artBarbershopTerms: LegalDocument = {
  title: "Terms of Service",
  eyebrow: "ART Barbershop legal",
  summary:
    "The terms that govern use of the ART Barbershop mobile application and appointment-booking service.",
  effectiveDate: "Effective and last updated: 14 July 2026",
  introduction: [
    'These Terms of Service ("Terms") govern your use of the ART Barbershop application and booking service. They form an agreement between you and ART Barbershop. By using the service, creating an account, or booking an appointment, you agree to these Terms.',
    "If you do not agree, do not use the service. Mandatory consumer rights under applicable law continue to apply and are not limited by these Terms.",
  ],
  sections: [
    {
      heading: "1. The service",
      paragraphs: [
        "The app lets users view shop information, services, barbers, prices and availability; book, review, reschedule, or cancel appointments; receive service messages; and manage account preferences. Authorized staff may use additional tools for schedules, services, appointments, and shop operations.",
      ],
    },
    {
      heading: "2. Eligibility and accounts",
      bullets: [
        "You must be at least 16, or use the service with permission and supervision from a parent or legal guardian.",
        "You must provide accurate information, use a phone number you are authorized to access, and keep your device and verification codes secure.",
        "You are responsible for activity carried out through your account. Tell us promptly if you suspect unauthorized access.",
        "Staff and owner functions may be used only by people authorized by ART Barbershop. You must not attempt to obtain or use a role that was not assigned to you.",
      ],
    },
    {
      heading: "3. Appointments, prices, and payment",
      paragraphs: [
        "An appointment is accepted when it appears as confirmed or upcoming in the app. Availability can change before a booking is completed. Please check the service, barber, date, time, duration, and price before confirming.",
        "Displayed prices are in Macedonian denars (MKD) unless stated otherwise. The app does not currently process payments. Payment is made directly to the shop unless ART Barbershop separately tells you otherwise. The final price may change only when you request or agree to a different service, or where correction of an obvious display error is permitted by law.",
      ],
    },
    {
      heading: "4. Changes, cancellations, and no-shows",
      paragraphs: [
        "Use the app to reschedule or cancel when those options are available, or contact the shop as soon as possible. ART Barbershop may change or cancel an appointment because of staff absence, schedule changes, safety concerns, errors, events outside reasonable control, or another legitimate operational reason. We will try to notify you and offer a reasonable alternative where possible.",
        "Repeated abusive bookings or no-shows may result in booking restrictions or account suspension. Any cancellation fee or special shop policy applies only if it was clearly disclosed before the booking or separately agreed and is lawful.",
      ],
    },
    {
      heading: "5. Communications",
      paragraphs: [
        "SMS messages are used to verify your phone number and may be subject to your mobile provider's normal charges. Optional push notifications may include confirmations, reminders, schedule changes, and cancellations. You can disable push notifications, but essential information may still be shown in the app or communicated by another reasonable method.",
      ],
    },
    {
      heading: "6. Your content",
      paragraphs: [
        "You may provide a name, booking notes, ratings, profile images, and, if authorized, service images or other shop content. You keep ownership of content you own, but give ART Barbershop a non-exclusive, worldwide, royalty-free license to host, copy, display, and process it only as needed to operate, secure, and improve the service.",
        "You must have the right to submit the content. It must not be unlawful, misleading, abusive, infringing, malicious, or contain another person's confidential or sensitive information without authorization. We may remove content that violates these Terms or the law.",
      ],
    },
    {
      heading: "7. Acceptable use",
      bullets: [
        "Do not impersonate another person, submit false bookings, harass staff or clients, or use the service for unlawful activity.",
        "Do not probe, disrupt, overload, reverse engineer, bypass access controls, introduce malicious code, scrape personal data, or attempt unauthorized access.",
        "Do not copy or commercially exploit the app, branding, listings, or content except where the law expressly allows it.",
      ],
    },
    {
      heading: "8. Privacy and third-party services",
      paragraphs: [
        "Our Privacy Policy explains how we process personal data and is incorporated into these Terms. The service relies on third-party hosting, SMS, notification, storage, map, phone, and app-store services. Their own terms and privacy policies may apply when you interact directly with them. We are not responsible for third-party sites or apps that we do not control.",
      ],
    },
    {
      heading: "9. Availability and intellectual property",
      paragraphs: [
        "We may maintain, change, suspend, or discontinue all or part of the service. We do not promise uninterrupted or error-free availability, but this does not affect obligations that cannot legally be excluded.",
        "The app, software, design, ART Barbershop branding, and shop-provided content are owned by ART Barbershop or its licensors and are protected by applicable intellectual-property laws. These Terms give you a limited, personal, revocable, non-transferable right to use the service for its intended purpose.",
      ],
    },
    {
      heading: "10. Responsibility and liability",
      paragraphs: [
        "You are responsible for checking appointment details and for arriving on time. Hair and grooming services are provided in person by the shop, not by the software platform itself. Tell the barber about relevant allergies, sensitivities, health conditions, or preferences before a service.",
        "To the maximum extent permitted by law, we are not liable for indirect or unforeseeable loss, loss caused by inaccurate information you provide, third-party services outside our control, or events outside our reasonable control. Nothing in these Terms excludes liability for fraud, intent, gross negligence, death or personal injury caused by negligence, or any consumer right or liability that cannot legally be excluded or limited.",
      ],
    },
    {
      heading: "11. Suspension, deletion, and termination",
      paragraphs: [
        "You may stop using the service or request account deletion in Settings. We may restrict or suspend access where reasonably necessary to protect users, the shop, or the service; investigate misuse; comply with law; or address a material breach of these Terms. Where appropriate, we will provide notice and an opportunity to resolve the issue.",
        "Terms that by their nature should continue after termination—including ownership, lawful record retention, disclaimers, liability limits, and dispute provisions—will remain effective.",
      ],
    },
    {
      heading: "12. Changes, governing law, and disputes",
      paragraphs: [
        "We may update these Terms to reflect service or legal changes. We will update the date above and provide reasonable notice of material changes. Continuing to use the service after the change takes effect means you accept the updated Terms, where permitted by law.",
        "These Terms are governed by the laws of the Republic of North Macedonia. Courts with jurisdiction where ART Barbershop is established will hear disputes, unless mandatory consumer law gives you the right to use another court or law. Please contact us first so we can try to resolve a concern informally.",
      ],
    },
  ],
  contact: {
    heading: "13. Contact",
    text: "Questions about these Terms or the service can be sent to ART Barbershop, Republic of North Macedonia.",
    email: "hello@digilence.io",
  },
};
