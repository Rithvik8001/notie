import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { DashboardSidebarHeader } from "./dashboard-sidebar-header";
import { DashboardSidebarFooter } from "./dashboard-sidebar-footer";
import { DashboardSidebarNav } from "./dashboard-sidebar-nav";
import type { User } from "./types";

interface DashboardSidebarProps {
  user: User;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export function DashboardSidebar({
  user,
  isLoggingOut,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <Sidebar>
      <DashboardSidebarHeader />
      <SidebarContent>
        <DashboardSidebarNav />
      </SidebarContent>
      <DashboardSidebarFooter
        user={user}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
      />
    </Sidebar>
  );
}

