import { Router } from "express";
import { signupRoute } from "./signup";

const route: Router = Router();

route.use("/", signupRoute);

export default route;
