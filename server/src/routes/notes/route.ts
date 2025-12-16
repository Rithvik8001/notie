import { Router } from "express";
import createNoteRoute from "./create-note";

const route: Router = Router();

route.use("/", createNoteRoute);

export default route;
