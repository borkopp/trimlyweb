"use client";

import {ChevronRight, type LucideIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const {state} = useSidebar();
  const isCollapsed = state === "collapsed";

  // Load initial states from localStorage
  useEffect(() => {
    const savedStates = localStorage.getItem("sidebarCollapsibleStates");
    if (savedStates) {
      setOpenStates(JSON.parse(savedStates));
    }
  }, []);

  // Save states to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(openStates).length > 0) {
      localStorage.setItem("sidebarCollapsibleStates", JSON.stringify(openStates));
    }
  }, [openStates]);

  // Determine if an item or its subitems are active based on the current pathname
  const isItemActive = (item: (typeof items)[0]) => {
    if (pathname === item.url) return true;
    return item.items?.some((subItem) => pathname === subItem.url) ?? false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isItemActive(item);

          // When sidebar is collapsed, make the icon clickable to the main URL
          if (isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} passHref>
                  <SidebarMenuButton tooltip={item.title} className="hover:bg-secondary">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          }

          // Regular expandable menu when sidebar is expanded
          return (
            <Collapsible
              key={item.title}
              asChild
              open={openStates[item.title] ?? isActive}
              onOpenChange={(open) => setOpenStates((prev) => ({...prev, [item.title]: open}))}
              className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="hover:bg-secondary">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild className="hover:bg-secondary">
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
