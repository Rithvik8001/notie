import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import getNotesController from "../../controllers/get-notes";

const getNotesRoute: Router = Router();

getNotesRoute.get("/get", asyncHandler(getNotesController));

export default getNotesRoute;
