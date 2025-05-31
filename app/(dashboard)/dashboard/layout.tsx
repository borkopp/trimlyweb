import { createClient } from "@/utils/supabase/server";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { redirect } from "next/navigation";
import QueryClientProvider from "@/components/providers/QueryClientProvider";
import { headers } from "next/headers";
import { BarbershopProvider } from "@/contexts/BarbershopContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeaderWithBreadcrumbs } from "@/components/dashboard/header-with-breadcrumbs";
import { getUser } from "@/app/actions/dashboard-actions";
import { CommandPalette } from "@/components/command-palette";
import { SpotlightCommand } from "@/components/spotlight-command";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const headersList = await headers();
  const barbershopId = headersList.get("x-barbershop-id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!barbershopId) {
    throw new Error("No barbershop ID found");
  }

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("*")
    .eq("id", parseInt(barbershopId))
    .single();

  if (!barbershop) {
    throw new Error("Barbershop not found");
  }

  return (
    <QueryClientProvider>
      <SidebarProvider>
        <BarbershopProvider barbershop={barbershop}>
          <div suppressHydrationWarning className="flex min-h-screen w-full">
            <TooltipProvider>
              <AppSidebar user={userProfile} />
              <SidebarInset>
                <DashboardHeaderWithBreadcrumbs
                  user={user}
                  barbershopId={parseInt(barbershopId)}
                />
                {children}
              </SidebarInset>
            </TooltipProvider>
            {/* Command Palette - Available globally throughout dashboard */}
            <CommandPalette
              userId={userProfile?.id}
              barbershopId={barbershopId}
            />
            {/* Spotlight Command - Quick actions with Cmd+J */}
            <SpotlightCommand
              userId={userProfile?.id}
              barbershopId={barbershopId}
            />
          </div>
        </BarbershopProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
