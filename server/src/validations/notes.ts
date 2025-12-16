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

export type CreateNoteData = z.infer<typeof createNoteSchema>;

export const createNoteValidation = async (payload: unknown) => {
  const result = createNoteSchema.safeParse(payload);
  return result;
};
