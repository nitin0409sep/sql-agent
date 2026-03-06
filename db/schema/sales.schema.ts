
import { sql } from "drizzle-orm/sql/sql";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { productTable } from "./product.schema";

export const salesTable = sqliteTable("sales", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    product_id: integer("product_id").notNull().references(() => productTable.id),
    quantity: integer("quantity").notNull(),
    total_amount: real("total_amount").notNull(),
    sales_date: text("sales_date").notNull().default(sql`CURRENT_TIMESTAMP`),
    customer_name: text("customer_name").notNull(),
    region: text("region").notNull(),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});