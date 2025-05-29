import { Footer } from "@/components/Footer";
import Navbar from "@/components/old-navbare";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen">
      {/* Remove the padding div and place Navbar directly */}
      {/* <Navbar /> */}
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* <ScrollToTopButton /> */}
    </section>
  );
}
