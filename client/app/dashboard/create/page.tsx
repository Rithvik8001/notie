"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notesStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { logout } from "@/services/auth";
import { userStore } from "@/store/store";
import { DashboardLayout } from "@/components/dashboard";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth";
import { TipTapEditor } from "@/components/editor/tiptap-editor";

export default function CreateNotePage() {
  const router = useRouter();
  const { user, isLoading, error, clearUser } = userStore();
  const { createNote } = notesStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === "" || !content) {
      toast.error("Title and content are required");
      return;
    }

    if (title.length > 100) {
      toast.error("Title must be 100 characters or less");
      return;
    }

    setIsCreating(true);

    try {
      await createNote(title.trim(), JSON.stringify(content));
      toast.success("Note created successfully");
      setTitle("");
      setContent(null);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        const errorWithDetails = err as Error & {
          errors?: Array<{ field: string; message: string }>;
        };

        if (errorWithDetails.errors && errorWithDetails.errors.length > 0) {
          const errorMessages = errorWithDetails.errors
            .map((error) => error.message)
            .join(", ");
          toast.error(errorMessages, {
            duration: 5000,
          });
        } else {
          toast.error(err.message, {
            duration: 4000,
          });
        }
      } else {
        toast.error("Failed to create note. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const createPageContent = (
    <SidebarInset>
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <SidebarTrigger />
      </div>
      <div className="p-8 max-w-3xl mx-auto w-full">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create New Note</h1>
          <p className="text-muted-foreground mt-2">
            Add a new note to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2 pb-4 border-b border-gray-100">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                disabled={isCreating}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <TipTapEditor
                initialContent={content}
                onChange={(data) => setContent(data.json)}
                placeholder="Start writing your note..."
                editable={!isCreating}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Note"}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  );

  return (
    <ProtectedRoute>
      <DashboardLayout
        user={user}
        isLoading={isLoading}
        error={error}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        customContent={createPageContent}
      />
    </ProtectedRoute>
  );
}
