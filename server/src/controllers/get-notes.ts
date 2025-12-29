import { Request, Response } from "express";
import { UserRequest } from "../utils/user-request";
import ErrorHandler from "../utils/errors-util";
import { db } from "../db/config";
import { notesTable } from "../db/schema";
import { eq, desc, count } from "drizzle-orm";
import { getNotesValidation } from "../validations/notes";

export default async function getNotesController(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as UserRequest).user.id;
  if (!userId) {
    throw ErrorHandler.unAuthorized("Unauthorized access");
  }

  const validation = await getNotesValidation(req.query);
  if (!validation.success) {
    throw ErrorHandler.validationError(validation.error);
  }

  const { page, limit } = validation.data;
  const offset = (page - 1) * limit;

  try {
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(notesTable)
      .where(eq(notesTable.userId, userId));

    const notes = await db
      .select({
        id: notesTable.id,
        title: notesTable.title,
        content: notesTable.content,
        createdAt: notesTable.createdAt,
        updatedAt: notesTable.updatedAt,
      })
      .from(notesTable)
      .where(eq(notesTable.userId, userId))
      .orderBy(desc(notesTable.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: {
        notes,
        pagination: {
          page,
          limit,
          totalNotes: totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Get notes error:", error);
    throw ErrorHandler.internalServerError("Failed to get notes");
  }
}
