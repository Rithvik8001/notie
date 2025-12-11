import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import logoutController from "../../controllers/logout";

export const logoutRoute: Router = Router();

logoutRoute.post("/logout", asyncHandler(logoutController));
