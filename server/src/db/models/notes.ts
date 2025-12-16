import { uuid, text, varchar } from "drizzle-orm/pg-core";
import { serial, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const notesTable = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),
});
