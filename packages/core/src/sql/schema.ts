import { integer, pgTable, text } from "drizzle-orm-pg";

export const users = pgTable('users', {
    id: integer('id').primaryKey(),
    name: text('name')
})