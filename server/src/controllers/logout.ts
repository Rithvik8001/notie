import { type Request, Response } from "express";
import ErrorHandler from "../utils/errors-util";

export default async function logoutController(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 0,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Logout error:", error);
    throw ErrorHandler.internalServerError(
      "Failed to logout. Please try again later."
    );
  }
}
