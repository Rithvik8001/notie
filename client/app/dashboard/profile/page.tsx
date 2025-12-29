"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import {
  DashboardLayout,
  DashboardProfileContent,
} from "@/components/dashboard";
import { userStore } from "@/store/store";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, error, fetchUser, clearUser } = userStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <DashboardLayout
      user={user}
      isLoading={isLoading}
      error={error}
      isLoggingOut={isLoggingOut}
      onLogout={handleLogout}
      customContent={user ? <DashboardProfileContent user={user} /> : undefined}
    />
  );
}
