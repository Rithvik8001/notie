import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "./types";

interface DashboardAccountCardProps {
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

export function DashboardAccountCard({ user }: DashboardAccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
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
            Member since
          </p>
          <p className="text-base mt-1">{formatDate(user.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">User ID</p>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {user.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

