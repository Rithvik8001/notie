import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import createNoteController from "../../controllers/create-note";

const createNoteRoute: Router = Router();

createNoteRoute.post("/create", asyncHandler(createNoteController));

export default createNoteRoute;
