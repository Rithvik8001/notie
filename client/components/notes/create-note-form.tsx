"use client";

import { useState } from "react";
import { notesStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function CreateNoteForm() {
  const { createNote } = notesStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
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
      await createNote(title.trim(), JSON.stringify(content));
      toast.success("Note created successfully");
      setTitle("");
      setContent(null);
      setOpen(false);
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
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        <div className="space-y-2 pb-4 border-b border-gray-100">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
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
          <Label htmlFor="content">Content</Label>
          <div className="relative">
            <TipTapEditor
              initialContent={content}
              onChange={(data) => setContent(data.json)}
              placeholder="Start writing your note..."
              editable={!isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-background">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Note"}
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-gray-100">
            <DrawerTitle>Create New Note</DrawerTitle>
            <DrawerDescription>
              Add a new note to your collection
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create Note
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <SheetTitle>Create New Note</SheetTitle>
          <SheetDescription>Add a new note to your collection</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden pt-6">{formContent}</div>
      </SheetContent>
    </Sheet>
  );
}
