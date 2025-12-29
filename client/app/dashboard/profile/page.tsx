"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/services/auth";
import {
  DashboardLayout,
  DashboardProfileContent,
  type User,
} from "@/components/dashboard";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
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
