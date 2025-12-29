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

const getNotesSchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0, "Page must be greater than 0"),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => val > 0 && val <= 100,
        "Limit must be between 1 and 100"
      ),
  })
  .strict();

export type CreateNoteData = z.infer<typeof createNoteSchema>;
export type EditNoteData = z.infer<typeof editNoteSchema>;
export type DeleteNoteData = z.infer<typeof deleteNoteSchema>;
export type GetNotesQuery = z.infer<typeof getNotesSchema>;

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

export const getNotesValidation = async (payload: unknown) => {
  const result = getNotesSchema.safeParse(payload);
  return result;
};
