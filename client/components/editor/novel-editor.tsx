"use client";

import { EditorRoot, EditorCommand, EditorCommandItem, EditorCommandEmpty, EditorContent, type JSONContent, EditorInstance, ImageResizer, handleCommandNavigation, handleImageDrop, handleImagePaste } from "novel";
import { defaultExtensions } from "./extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import { useState } from "react";

interface NovelEditorProps {
  initialContent?: JSONContent | string;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
  editable?: boolean;
}

export function NovelEditor({
  initialContent,
  onChange,
  placeholder = "Press '/' for commands, or start typing...",
  editable = true
}: NovelEditorProps) {
  const [initialContentState] = useState(() => {
    if (!initialContent) return undefined;
    try {
      return typeof initialContent === "string"
        ? JSON.parse(initialContent)
        : initialContent;
    } catch {
      return undefined;
    }
  });

  const extensions = [...defaultExtensions, slashCommand];

  return (
    <EditorRoot>
      <EditorContent
        className={editable ? "border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto" : ""}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => {
              // Only handle command navigation for slash command, allow normal arrow keys
              if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                // Check if command menu is open
                const commandMenu = document.querySelector('[cmdk-root]');
                if (commandMenu) {
                  return handleCommandNavigation(event);
                }
                return false; // Allow normal navigation
              }
              return handleCommandNavigation(event);
            },
          },
          handlePaste: (view, event) => editable ? handleImagePaste(view, event, uploadFn) : false,
          handleDrop: (view, event, _slice, moved) => editable ? handleImageDrop(view, event, moved, uploadFn) : false,
          attributes: {
            class: "prose prose-sm sm:prose-base focus:outline-none max-w-full min-h-[250px]",
          },
        }}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          onChange?.(json);
        }}
        initialContent={initialContentState}
        slotAfter={editable ? <ImageResizer /> : null}
        editable={editable}
      >
        {editable && (
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommand>
        )}
      </EditorContent>
    </EditorRoot>
  );
}

// Placeholder upload function - you can implement actual image upload later
const uploadFn = async (file: File) => {
  // TODO: Implement actual file upload to your server
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
