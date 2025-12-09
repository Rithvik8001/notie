import { z } from "zod";

const loginUserSchema = z
  .object({
    email: z
      .email("Invalid email address")
      .max(30, "Cannot exceed 30 characters")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must not exceed 20 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  })
  .strict();

export type loginData = z.infer<typeof loginUserSchema>;

const loginValidation = async (payload: unknown) => {
  const result = loginUserSchema.safeParse(payload);
  return result;
};

export default loginValidation;
