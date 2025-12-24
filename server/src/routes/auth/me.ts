import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import meController from "../../controllers/me";
import { authMiddleware } from "../../middleware/auth/auth";

const meRoute: Router = Router();

meRoute.get("/me", authMiddleware, asyncHandler(meController));

export { meRoute };
