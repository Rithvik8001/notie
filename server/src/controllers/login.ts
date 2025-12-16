import { type Request, Response } from "express";
import loginValidation from "../validations/login";
import { db } from "../db/config";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errors-util";
import jwt from "jsonwebtoken";

export default async function loginController(
  req: Request,
  res: Response
): Promise<void> {
  const result = await loginValidation(req.body);

  if (!result.success) {
    throw ErrorHandler.validationError(result.error);
  }

  const { email, password } = result.data;

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw ErrorHandler.internalServerError(
        "Authentication is not configured (JWT_SECRET missing)."
      );
    }

    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (user.length === 0) {
      throw ErrorHandler.unAuthorized(
        "Email not found. Please check your email or create a new account."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      throw ErrorHandler.unAuthorized(
        "Invalid email or password. Please try again."
      );
    }

    const token = jwt.sign({ userId: user[0].id }, jwtSecret, {
      expiresIn: "1d",
    });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user[0].id,
        email: user[0].email,
      },
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Login error:", error);
    throw ErrorHandler.internalServerError(
      "Login failed. Please try again later."
    );
  }
}
