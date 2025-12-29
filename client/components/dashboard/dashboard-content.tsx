import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardAccountCard } from "./dashboard-account-card";
import type { User } from "./types";

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <SidebarInset>
      <div className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
      </div>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s your account information.
          </p>
        </div>

        <DashboardAccountCard user={user} />
      </div>
    </SidebarInset>
  );
}

