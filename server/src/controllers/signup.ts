import { type Request, Response } from "express";
import { signupValidation } from "../validations/signup";
import { db } from "../db/config";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errors-util";

export default async function signupController(
  req: Request,
  res: Response
): Promise<void> {
  const result = await signupValidation(req.body);

  if (!result.success) {
    throw ErrorHandler.validationError(result.error);
  }
  const { email, password, userName } = result.data;

  try {
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw ErrorHandler.conflict(
        "Email already registered. Please use a different email or try logging in."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(userTable)
      .values({
        email,
        password: hashedPassword,
        ...(userName && { userName }),
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
      },
    });
    return;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }
    console.error("Signup error:", error);
    throw ErrorHandler.internalServerError(
      "Failed to create account. Please try again later."
    );
  }
}
