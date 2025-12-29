import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "./types";

interface DashboardUserInfoProps {
  user: User;
}

function getUserInitials(userName: string | null, email: string): string {
  if (userName) {
    return userName.charAt(0).toUpperCase();
  }
  return email.charAt(0).toUpperCase();
}

export function DashboardUserInfo({ user }: DashboardUserInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>
          {getUserInitials(user.userName, user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {user.userName || "user"}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </div>
  );
}
