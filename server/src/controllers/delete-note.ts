import { type Request, type Response } from "express";
import { UserRequest } from "../utils/user-request";
import ErrorHandler from "../utils/errors-util";
import { deleteNoteValidation } from "../validations/notes";
import { db } from "../db/config";
import { eq, and } from "drizzle-orm";
import { notesTable } from "../db/models/notes";

export default async function deleteNoteController(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as UserRequest).user.id;
  if (!userId) {
    throw ErrorHandler.unAuthorized("Unauthorized access");
  }

  try {
    const result = await deleteNoteValidation(req.body);
    if (!result.success) {
      throw ErrorHandler.validationError(result.error);
    }
    const { id } = result.data;

    const deletedNote = await db
      .delete(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .returning();

    if (!deletedNote) {
      throw ErrorHandler.notFound("Note not found");
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Delete note error:", error);
    throw ErrorHandler.internalServerError("Failed to delete note");
  }
}
