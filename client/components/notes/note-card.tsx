"use client";

import { Note } from "@/services/notes";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-lg line-clamp-1">{note.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {note.content}
        </p>
      </div>
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-muted-foreground">
          {formatDate(note.createdAt)}
        </p>
      </div>
    </div>
  );
}
