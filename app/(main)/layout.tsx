import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <section className="relative min-h-screen">
      {/* Remove the padding div and place Navbar directly */}
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTopButton />
    </section>
  );
}
