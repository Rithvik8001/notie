"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "@/store/store";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export function PublicRoute({
  children,
  redirectIfAuthenticated = false,
}: PublicRouteProps) {
  const router = useRouter();
  const { user, isLoading, fetchUser } = userStore();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (redirectIfAuthenticated && !isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, redirectIfAuthenticated, router]);

  if (redirectIfAuthenticated && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (redirectIfAuthenticated && user) {
    return null;
  }

  return <>{children}</>;
}
