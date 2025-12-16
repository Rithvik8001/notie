import { type Request, type Response } from "express";
import { notesTable, userTable } from "../db/schema";
import ErrorHandler from "../utils/errors-util";
import { createNoteValidation } from "../validations/notes";
import { db } from "../db/config";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof userTable>;

interface UserRequest extends Request {
  user: User;
}

export default async function createNoteController(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as UserRequest).user.id;

  if (!userId) {
    throw ErrorHandler.unAuthorized("Unauthorized access");
  }

  const result = await createNoteValidation(req.body);
  if (!result.success) {
    throw ErrorHandler.validationError(result.error);
  }

  const { title, content } = result.data;

  try {
    const [newNote] = await db
      .insert(notesTable)
      .values({
        title,
        content,
        userId,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {
        id: newNote.id,
        title: newNote.title,
        content: newNote.content,
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt,
      },
    });

    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Create note error:", error);
    throw ErrorHandler.internalServerError(
      "Failed to create note. Please try again later."
    );
  }
}
