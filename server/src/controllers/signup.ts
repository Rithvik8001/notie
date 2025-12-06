import { type Request, Response } from "express";
import { signupValidation } from "../validations/signup";
import { db } from "../db/config";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export default async function signupController(
  req: Request,
  res: Response
): Promise<void> {
  const result = await signupValidation(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Data is invalid",
    });
    return;
  }

  const { email, password, userName } = result.data;

  try {
    // Check if email already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(409).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user (userName is optional, only include if present)
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
      message: "User created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
