"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  Users,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import routes from "@/config/route";

// Icon mapping
const iconMap = {
  LayoutDashboard,
  CheckSquare,
  Folder,
  Users,
  Settings,
};

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground relative">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-blue-500 rounded"></div>
            <span className="font-semibold text-sm">Y-ALM</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => {
                const Icon = iconMap[route.icon as keyof typeof iconMap];
                const isActive = pathname === route.path;
                
                return (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={route.path}>
                        <Icon className="w-4 h-4" />
                        <span>{route.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          Y-ALM v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
