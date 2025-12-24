import { Router } from "express";
import { signupRoute } from "./signup";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { meRoute } from "./me";

const route: Router = Router();

route.use("/", signupRoute);
route.use("/", loginRoute);
route.use("/", logoutRoute);
route.use("/", meRoute);

export default route;
