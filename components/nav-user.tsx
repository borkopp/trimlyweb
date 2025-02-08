"use client";

import {BadgeCheck, Bell, CreditCard, LogOut, Scissors, Sparkles, User, Calendar, Settings2} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {createClient} from "@/utils/supabase/client";
import React, {useEffect, useState} from "react";

async function getImageUrl(path: string) {
  const supabase = createClient();
  const {data} = await supabase.storage.from("barber-images").getPublicUrl(path);
  return data?.publicUrl || null;
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const {isMobile} = useSidebar();

  useEffect(() => {
    async function fetchAvatar() {
      if (user.avatar && !user.avatar.startsWith("http")) {
        const url = await getImageUrl(user.avatar);
        setAvatarUrl(url);
      } else {
        setAvatarUrl(user.avatar);
      }
    }

    fetchAvatar();
  }, [user.avatar]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-secondary">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl || "/og-image.png"} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary">
                  <Scissors className="text-white p-0.5" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs opacity-70">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl || "/og-image.png"} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary">
                    <Scissors className="text-white p-0.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs opacity-70">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell size={16} className="mr-2" />
                Notifications
                <span className="ml-auto bg-primary/10 px-2 py-0.5 text-xs rounded-full">3</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings2 size={16} className="mr-2" />
                Shop Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard size={16} className="mr-2" />
                Payment Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
