import { createClient } from "@/utils/supabase/server";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { redirect } from "next/navigation";
import QueryClientProvider from "@/components/providers/QueryClientProvider";
import { tenantContext } from "@/lib/tenant-context";
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
  const tenant = await tenantContext.getTenantContext();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (tenant.isMainDomain || tenant.id <= 0) {
    redirect("/login");
  }

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("*")
    .eq("id", tenant.id)
    .single();

  if (!barbershop) {
    redirect("/login");
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
                  barbershopId={tenant.id}
                />
                {children}
              </SidebarInset>
            </TooltipProvider>
            <CommandPalette
              userId={userProfile?.id}
              barbershopId={tenant.id.toString()}
            />
            <SpotlightCommand
              userId={userProfile?.id}
              barbershopId={tenant.id.toString()}
            />
          </div>
        </BarbershopProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
