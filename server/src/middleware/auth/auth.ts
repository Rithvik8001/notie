import { type Request, type Response, type NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import ErrorHandler from "../../utils/errors-util";
import { userTable } from "../../db/schema";
import { db } from "../../db/config";
import { eq } from "drizzle-orm";

const extractToken = (req: Request) => {
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer")) {
    return authHeader.slice(7);
  }
  return undefined;
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(ErrorHandler.unAuthorized("Unauthorized access"));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured");
      return next(
        ErrorHandler.internalServerError("Failed to authenticate user")
      );
    }

    const decoded = jwt.verify(token, secret);
    const userId =
      typeof decoded === "object" && "userId" in decoded
        ? (decoded as { userId: string }).userId
        : undefined;
    if (!userId) {
      return next(ErrorHandler.unAuthorized("Unauthorized access"));
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    if (!user) {
      return next(ErrorHandler.unAuthorized("Unauthorized access"));
    }

    (req as Request & { user: typeof user }).user = user;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(ErrorHandler.unAuthorized("Token expired"));
    }
    if (error instanceof JsonWebTokenError) {
      return next(ErrorHandler.unAuthorized("Invalid token"));
    }
    if (error instanceof ErrorHandler) {
      return next(error);
    }
    console.error("Authentication error:", error);
    return next(
      ErrorHandler.internalServerError("Failed to authenticate user")
    );
  }
};
