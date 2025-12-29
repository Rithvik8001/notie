"use client";

import { useState } from "react";
import { notesStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { NovelEditor } from "@/components/editor/novel-editor";
import type { JSONContent } from "novel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Note } from "@/services/notes";

interface EditNoteFormProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNoteForm({ note, open, onOpenChange }: EditNoteFormProps) {
  const { updateNote } = notesStore();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState<JSONContent | string>(note.content);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

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

    setIsLoading(true);

    try {
      const contentString = typeof content === 'string' ? content : JSON.stringify(content);
      await updateNote(note.id, {
        title: title.trim(),
        content: contentString,
      });
      toast.success("Note updated successfully");
      onOpenChange(false);
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
        toast.error("Failed to update note. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
      <div className="space-y-4">
        <div className="space-y-2 pb-4 border-b border-gray-100">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {title.length}/100 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-content">Content</Label>
          <NovelEditor
            initialContent={content}
            onChange={(json) => setContent(json)}
            placeholder="Press '/' for formatting commands, or just start writing your note..."
            editable={!isLoading}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Note"}
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-100">
            <DrawerTitle>Edit Note</DrawerTitle>
            <DrawerDescription>Make changes to your note</DrawerDescription>
          </DrawerHeader>
          <div className="pt-6 max-h-[80vh] overflow-y-auto">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <SheetTitle>Edit Note</SheetTitle>
          <SheetDescription>Make changes to your note</SheetDescription>
        </SheetHeader>
        <div className="pt-6">{formContent}</div>
      </SheetContent>
    </Sheet>
  );
}
