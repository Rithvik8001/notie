import { sql } from "drizzle-orm";
import { uuid, varchar, pgTable, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userName: varchar("user_name", { length: 30 }).default(sql`NULL`),
  email: varchar("email", { length: 30 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
