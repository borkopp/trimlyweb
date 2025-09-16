import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Lato, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { BarbershopProvider } from "@/contexts/BarbershopContext";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const filmfiction = localFont({
  src: "../public/fonts/FilmFiction-Bold.otf",
  variable: "--font-ff",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fadely.app"),
  title: {
    default:
      "fadely - Barbershop Management System | Book & Manage Appointments",
    template: "%s | Fadely Barbershop Management",
  },
  description:
    "Fadely is the leading barbershop management system. Get your own branded mobile app, online booking system, and complete barbershop management solution. Perfect for modern barbershops.",
  keywords: [
    "fadely",
    "barbershop management system",
    "barbershop software",
    "barber appointment system",
    "barbershop management",
    "barber booking app",
    "barbershop scheduling",
    "barber management software",
    "barbershop pos",
    "barbershop booking system",
    "barbershop appointment app",
  ],
  authors: [{ name: "Fadely" }],
  creator: "Fadely",
  publisher: "Fadely",
  applicationName: "Fadely",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark light",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fadely.app",
    title: "fadely - Barbershop Management System | Book & Manage Appointments",
    description:
      "Fadely is the leading barbershop management system. Get your own branded mobile app, online booking system, and complete barbershop management solution. Perfect for modern barbershops.",
    siteName: "Fadely",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fadely - The Complete Barbershop Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "fadely - Barbershop Management System | Book & Manage Appointments",
    description:
      "Fadely is the leading barbershop management system. Get your own branded mobile app, online booking system, and complete barbershop management solution.",
    images: ["/og-image.png"],
    creator: "@fadely",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "aN7Oml3UrzXpfFJ6UdI6KdhTOW3wOcXvHQ319IkQipU",
  },
  alternates: {
    canonical: "https://fadely.app",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const barbershopId = headersList.get("x-barbershop-id");

  const supabase = await createClient();

  let barbershop = null;
  if (barbershopId) {
    const { data } = await supabase
      .from("barbershops")
      .select("*")
      .eq("id", barbershopId)
      .single();
    barbershop = data;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${filmfiction.variable} ${montserrat.variable} ${lato.variable} ${orbitron.variable} font-inter`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {barbershop ? (
            <BarbershopProvider barbershop={barbershop}>
              {children}
            </BarbershopProvider>
          ) : (
            children
          )}
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
