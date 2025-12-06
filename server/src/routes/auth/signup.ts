import { Router } from "express";
import signupController from "../../controllers/signup";

export const signupRoute: Router = Router();

signupRoute.post("/signup", signupController);
