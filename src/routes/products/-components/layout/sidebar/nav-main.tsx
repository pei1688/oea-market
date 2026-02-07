"use client";

import { Box, House } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem className="space-y-6 flex flex-col">
          <Link to={"/products/dashboard"}>
            <SidebarMenuButton tooltip={"首頁"}>
              <House className="size-4" />
              <span>首頁</span>
            </SidebarMenuButton>
          </Link>
          <Link to={"/products"}>
            <SidebarMenuButton tooltip={"商品列表"}>
              <Box className="size-4" />
              <span>商品列表</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
