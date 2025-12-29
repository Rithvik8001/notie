"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { DashboardLayout } from "@/components/dashboard";
import { userStore } from "@/store/store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, error, fetchUser, clearUser } = userStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Fetch user from store (will use cached if available, otherwise fetch from API)
    // On page refresh, store is cleared, so it will fetch from API
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
    />
  );
}
