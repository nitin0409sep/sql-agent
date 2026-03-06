
import { sql } from "drizzle-orm/sql/sql";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const productTable = sqliteTable("products", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    price: real("price").notNull(),
    stock: integer("stock").notNull().default(0),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});