import { Router } from "express";
import loginController from "../../controllers/login";
import { asyncHandler } from "../../middleware/errorHandler";

export const loginRoute: Router = Router();

loginRoute.post("/login", asyncHandler(loginController));
