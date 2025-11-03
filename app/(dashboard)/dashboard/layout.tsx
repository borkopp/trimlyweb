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

  const effectiveTenantId =
    tenant && !tenant.isMainDomain && tenant.id > 0
      ? tenant.id
      : userProfile?.barbershop_id || 0;

  if (!effectiveTenantId || effectiveTenantId <= 0) {
    redirect("/login");
  }

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("*")
    .eq("id", effectiveTenantId)
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
                  barbershopId={effectiveTenantId}
                />
                {children}
              </SidebarInset>
            </TooltipProvider>
            <CommandPalette
              userId={userProfile?.id}
              barbershopId={effectiveTenantId.toString()}
            />
            <SpotlightCommand
              userId={userProfile?.id}
              barbershopId={effectiveTenantId.toString()}
            />
          </div>
        </BarbershopProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
