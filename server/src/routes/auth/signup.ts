import { Router } from "express";
import signupController from "../../controllers/signup";
import { asyncHandler } from "../../middleware/errorHandler";

export const signupRoute: Router = Router();

signupRoute.post("/signup", asyncHandler(signupController));
