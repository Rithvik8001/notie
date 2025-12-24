import { z } from "zod";

const createNoteSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must not exceed 100 characters"),
    content: z.string().min(1, "Content is required"),
  })
  .strict();

const editNoteSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must not exceed 100 characters")
      .optional(),
    content: z.string().min(1, "Content is required").optional(),
  })
  .strict();

const deleteNoteSchema = z
  .object({
    id: z
      .string()
      .uuid("Note ID must be a valid UUID")
      .min(1, "Note ID is required"),
  })
  .strict();

export type CreateNoteData = z.infer<typeof createNoteSchema>;
export type EditNoteData = z.infer<typeof editNoteSchema>;
export type DeleteNoteData = z.infer<typeof deleteNoteSchema>;

export const createNoteValidation = async (payload: unknown) => {
  const result = createNoteSchema.safeParse(payload);
  return result;
};

export const editNoteValidation = async (payload: unknown) => {
  const result = editNoteSchema.safeParse(payload);
  return result;
};

export const deleteNoteValidation = async (payload: unknown) => {
  const result = deleteNoteSchema.safeParse(payload);
  return result;
};
