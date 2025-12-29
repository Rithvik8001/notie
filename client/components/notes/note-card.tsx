"use client";

import { useState } from "react";
import { Note } from "@/services/notes";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteNoteDialog } from "./delete-note-dialog";
import { EditNoteForm } from "./edit-note-form";
import { NovelEditor } from "@/components/editor/novel-editor";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(note.id);
    setShowDeleteDialog(false);
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  return (
    <>
      <div className="border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg line-clamp-1">{note.title}</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditClick}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4 max-h-48 overflow-hidden">
          <div className="line-clamp-3">
            <NovelEditor
              initialContent={note.content}
              editable={false}
            />
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)}
          </p>
        </div>
      </div>

      <DeleteNoteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        noteTitle={note.title}
      />

      <EditNoteForm
        note={note}
        open={showEditForm}
        onOpenChange={setShowEditForm}
      />
    </>
  );
}
