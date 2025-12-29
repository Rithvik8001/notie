"use client";

import { useEffect, useState } from "react";
import { notesStore } from "@/store/store";
import { NoteCard } from "./note-card";
import { NotesListSkeleton } from "./note-skeleton";
import { toast } from "sonner";

export function NotesList() {
  const { notes, isLoading, error, fetchNotes, deleteNote } = notesStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteNote(id);
      toast.success("Note deleted successfully");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete note");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && notes.length === 0) {
    return <NotesListSkeleton />;
  }

  if (error) {
    return (
      <div className="border border-destructive/20 bg-destructive/5 p-6 rounded-md">
        <p className="text-sm text-destructive text-center">{error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="border border-gray-100 p-12">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No notes yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first note to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
