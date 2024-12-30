export default function JsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Fadely",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Fadely is the leading barbershop management system offering a complete solution for modern barbershops including appointment booking, staff management, and customer engagement.",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
      },
      featureList: [
        "Online Appointment Booking",
        "Staff Management",
        "Customer Management",
        "Mobile App",
        "Analytics Dashboard",
        "Payment Processing",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Fadely",
      url: "https://fadely.app",
      logo: "https://fadely.app/og-image.png",
      sameAs: [
        "https://twitter.com/fadely",
        // Add your other social media URLs here
      ],
      description:
        "Fadely is the leading barbershop management system. We provide complete solutions for modern barbershops including appointment booking, staff management, and customer engagement.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Fadely Barbershop Management System",
      url: "https://fadely.app",
      applicationCategory: "BusinessApplication",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      permissions: "User information, Appointment data",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
      ))}
    </>
  );
}
