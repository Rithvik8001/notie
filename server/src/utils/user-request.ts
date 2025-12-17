// user request type
import { type Request } from "express";
import { InferSelectModel } from "drizzle-orm";
import { userTable } from "../db/schema";

type User = InferSelectModel<typeof userTable>;

export type UserRequest = Request & {
  user: User;
};
