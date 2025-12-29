import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { NotesList, CreateNoteForm } from "@/components/notes";
import type { User } from "./types";

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <SidebarInset>
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <div className="w-48">
          <CreateNoteForm />
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage your notes
          </p>
        </div>

        <NotesList />
      </div>
    </SidebarInset>
  );
}

