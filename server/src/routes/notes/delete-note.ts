import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import deleteNoteController from "../../controllers/delete-note";

const deleteNoteRoute: Router = Router();

deleteNoteRoute.delete("/delete/:id", asyncHandler(deleteNoteController));

export default deleteNoteRoute;
