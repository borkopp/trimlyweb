import {DashboardSidebar} from "@/components/DashboardSidebar";
import {createClient} from "@/utils/supabase/server";
import {TooltipProvider} from "@radix-ui/react-tooltip";
import {redirect} from "next/navigation";

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <TooltipProvider>
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">{children}</div>
      </TooltipProvider>
    </div>
  );
}
