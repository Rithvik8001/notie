import { Separator } from "@/components/ui/separator";
import { SidebarFooter } from "@/components/ui/sidebar";
import { DashboardUserInfo } from "./dashboard-user-info";
import { DashboardLogoutDialog } from "./dashboard-logout-dialog";
import type { User } from "./types";

interface DashboardSidebarFooterProps {
  user: User;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export function DashboardSidebarFooter({
  user,
  isLoggingOut,
  onLogout,
}: DashboardSidebarFooterProps) {
  return (
    <SidebarFooter>
      <div className="flex flex-col gap-2 p-2">
        <DashboardUserInfo user={user} />
        <Separator />
        <DashboardLogoutDialog isLoggingOut={isLoggingOut} onLogout={onLogout} />
      </div>
    </SidebarFooter>
  );
}

