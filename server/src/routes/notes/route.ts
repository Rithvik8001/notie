import { Router } from "express";
import createNoteRoute from "./create-note";
import editNotesRoute from "./edit-notes";
import deleteNoteRoute from "./delete-note";

const route: Router = Router();

route.use("/", createNoteRoute);
route.use("/", editNotesRoute);
route.use("/", deleteNoteRoute);

export default route;
