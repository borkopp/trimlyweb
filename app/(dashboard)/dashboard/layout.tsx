import {DashboardSidebar} from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {createClient} from "@/utils/supabase/server";
import {TooltipProvider} from "@radix-ui/react-tooltip";
import {redirect} from "next/navigation";
import QueryClientProvider from "@/components/providers/QueryClientProvider";
import {headers} from "next/headers";
import {BarbershopProvider} from "@/contexts/BarbershopContext";

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const supabase = createClient();
  const headersList = headers();
  const barbershopId = headersList.get("x-barbershop-id");

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!barbershopId) {
    throw new Error("No barbershop ID found");
  }

  const {data: barbershop} = await supabase.from("barbershops").select("*").eq("id", parseInt(barbershopId)).single();

  if (!barbershop) {
    throw new Error("Barbershop not found");
  }

  return (
    <QueryClientProvider>
      <BarbershopProvider barbershop={barbershop}>
        <div className="flex min-h-screen w-full flex-col bg-muted/20">
          <TooltipProvider>
            <DashboardSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <DashboardHeader />
              {children}
            </div>
          </TooltipProvider>
        </div>
      </BarbershopProvider>
    </QueryClientProvider>
  );
}
