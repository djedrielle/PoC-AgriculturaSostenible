import { 
  Sprout, 
  TrendingUp, 
  Shield, 
  Wallet, 
  ShoppingCart,
  BarChart3,
  FileCheck
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const farmerItems = [
  { title: "Tokenize Production", url: "/farmer/tokenize", icon: Sprout },
  { title: "Validation Info", url: "/farmer/validation", icon: FileCheck },
  { title: "Analytics", url: "/farmer/analytics", icon: BarChart3 },
];

const investorItems = [
  { title: "Market", url: "/investor/market", icon: ShoppingCart },
  { title: "My Wallet", url: "/investor/wallet", icon: Wallet },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon"  className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <h2 className={`font-bold text-sidebar-primary ${isCollapsed ? "text-xs text-center" : "text-lg"}`}>
            {isCollapsed ? "AT" : "AgroToken"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Farmer
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {farmerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Investor
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {investorItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
