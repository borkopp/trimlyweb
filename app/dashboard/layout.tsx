import {DashboardSidebar} from "@/components/DashboardSidebar";
import Navbar from "@/components/Navbar";
import {TooltipProvider} from "@/components/ui/tooltip";

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TooltipProvider>
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">{children}</div>
      </TooltipProvider>
    </div>
  );
}
