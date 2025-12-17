import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import editNotesController from "../../controllers/edit-note";

const editNotesRoute: Router = Router();

editNotesRoute.put("/edit/:id", asyncHandler(editNotesController));

export default editNotesRoute;
