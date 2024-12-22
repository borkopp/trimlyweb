import type {Metadata} from "next";
import localFont from "next/font/local";
import {Montserrat, Lato} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toaster";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";
import {headers} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {BarbershopProvider} from "@/contexts/BarbershopContext";

const inter = localFont({
  src: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
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
    default: "Fadely - Branded Barbershop Management System",
    template: "%s | Fadely",
  },
  description: "Get your branded mobile app for your barbershop with Fadely. Book appointments, manage staff, and grow your business.",
  keywords: ["barbershop software", "barber appointment system", "barbershop management", "fadely", "barber booking app"],
  authors: [{name: "Fadely"}],
  creator: "Fadely",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fadely.app",
    title: "Fadely - Branded Barbershop Management System",
    description: "Get your branded mobile app & dashboard for your barbershop with Fadely. Book appointments, manage staff, and grow your business.",
    siteName: "Fadely",
    images: [
      {
        url: "/og-image.png", // Make sure to create this image
        width: 1200,
        height: 630,
        alt: "Fadely - Barbershop Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fadely - Branded Barbershop Management System",
    description: "Get your branded mobile app & dashboard for your barbershop with Fadely. Book appointments, manage staff, and grow your business.",
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
    google: "EyZ98HXkARVHeRpTS-zPRAOM4fXa_nuaLBs_KjOXZI4", // Add your Google Search Console verification code
  },
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const headersList = headers();
  const barbershopId = headersList.get("x-barbershop-id");

  const supabase = createClient();

  let barbershop = null;
  if (barbershopId) {
    const {data} = await supabase.from("barbershops").select("*").eq("id", barbershopId).single();
    barbershop = data;
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${filmfiction.variable} ${montserrat.variable} ${lato.variable} font-inter`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {barbershop ? <BarbershopProvider barbershop={barbershop}>{children}</BarbershopProvider> : children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
