import Navbar from "@/components/Navbar";
import {TooltipProvider} from "@/components/ui/tooltip";

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <TooltipProvider>
        {/* <Navbar /> */}
        {children}
      </TooltipProvider>
    </section>
  );
}
