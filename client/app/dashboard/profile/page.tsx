"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import {
  DashboardLayout,
  DashboardProfileContent,
} from "@/components/dashboard";
import { userStore } from "@/store/store";
import { ProtectedRoute } from "@/components/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, error, clearUser } = userStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      clearUser();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout
        user={user}
        isLoading={isLoading}
        error={error}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        customContent={user ? <DashboardProfileContent user={user} /> : undefined}
      />
    </ProtectedRoute>
  );
}
