"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardContent } from "./dashboard-content";
import { DashboardSidebarHeader } from "./dashboard-sidebar-header";
import type { User } from "./types";

interface DashboardLayoutProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggingOut: boolean;
  onLogout: () => void;
  customContent?: React.ReactNode;
}

export function DashboardLayout({
  user,
  isLoading,
  error,
  isLoggingOut,
  onLogout,
  customContent,
}: DashboardLayoutProps) {
  if (isLoading) {
    return (
      <SidebarProvider>
        <Sidebar>
          <DashboardSidebarHeader />
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <Sidebar>
          <DashboardSidebarHeader />
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={user}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
      />
      {customContent || <DashboardContent user={user} />}
    </SidebarProvider>
  );
}
