import { type Request, type Response, type NextFunction } from "express";
import ErrorHandler from "../utils/errors-util";

export const errorHandlingMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ErrorHandler) {
    const errorResponse = err.getResponse();
    return res.status(err.statusCode).json(errorResponse);
  }

  console.error("Unhandled error:", err);

  // Default error response
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error",
  });
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
