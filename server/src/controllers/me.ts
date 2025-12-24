import { type Request, type Response } from "express";
import ErrorHandler from "../utils/errors-util";
import { UserRequest } from "../utils/user-request";

export default async function meController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = (req as UserRequest).user;

    if (!user) {
      throw ErrorHandler.unAuthorized("Unauthorized access");
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        createdAt: user.createdAt,
      },
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Get user error:", error);
    throw ErrorHandler.internalServerError(
      "Failed to retrieve user. Please try again later."
    );
  }
}
