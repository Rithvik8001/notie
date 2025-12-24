import { type Request, type Response } from "express";
import ErrorHandler from "../utils/errors-util";
import { UserRequest } from "../utils/user-request";
import { editNoteValidation } from "../validations/notes";
import { db } from "../db/config";
import { notesTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

export default async function editNotesController(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as UserRequest).user.id;
  try {
    if (!userId) {
      throw ErrorHandler.unAuthorized("Unauthorized access");
    }

    const result = await editNoteValidation(req.body);
    if (!result.success) {
      throw ErrorHandler.validationError(result.error);
    }

    const { title, content } = result.data;

    if (title === undefined && content === undefined) {
      throw ErrorHandler.badRequest(
        "At least one field (title or content) must be provided"
      );
    }

    const noteId = req.params.id;
    if (!noteId || typeof noteId !== "string") {
      throw ErrorHandler.badRequest("Invalid note ID");
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(noteId)) {
      throw ErrorHandler.badRequest("Note ID must be a valid UUID");
    }

    const updateData: { title?: string; content?: string } = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const [updatedNote] = await db
      .update(notesTable)
      .set(updateData)
      .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, userId)))
      .returning();

    if (!updatedNote) {
      throw ErrorHandler.notFound("Note not found");
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: {
        id: updatedNote.id,
        title: updatedNote.title,
        content: updatedNote.content,
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt,
      },
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Edit note error:", error);
    throw ErrorHandler.internalServerError(
      "Failed to edit note. Please try again later."
    );
  }
}
