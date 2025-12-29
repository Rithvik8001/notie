import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "./types";

interface DashboardProfileContentProps {
  user: User;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function getUserInitials(userName: string | null, email: string): string {
  if (userName) {
    return userName.charAt(0).toUpperCase();
  }
  return email.charAt(0).toUpperCase();
}

export function DashboardProfileContent({
  user,
}: DashboardProfileContentProps) {
  return (
    <SidebarInset>
      <div className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
      </div>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your profile information.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarFallback className="text-lg">
                  {getUserInitials(user.userName, user.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user.userName || "User"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="text-base mt-1">{user.email}</p>
              </div>

              {user.userName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p className="text-base mt-1">{user.userName}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <p className="text-base mt-1">{formatDate(user.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {user.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}

