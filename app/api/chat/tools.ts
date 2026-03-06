import { db } from "@/db/db";
import { sql } from "drizzle-orm";

export const schemaTool = async () => {
    const result = await db.run(
        sql`SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream_%' AND name NOT LIKE 'libsql_%'`
    );
    const schema = result.rows
        .map((row: Record<string, unknown>) => row.sql)
        .join("\n\n");

    return schema;
}


// Sanitization 
const FORBIDDEN_KEYWORDS = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|REPLACE|ATTACH|DETACH|PRAGMA|REINDEX|VACUUM)\b/i;

export const dbTool = async ({ query }: { query: string }) => {
    const trimmed = query.trim().replace(/;+$/, "");

    if (!trimmed.toUpperCase().startsWith("SELECT")) {
        return "Error: Only SELECT queries are allowed.";
    }

    if (FORBIDDEN_KEYWORDS.test(trimmed)) {
        return "Error: Query contains forbidden keywords.";
    }

    if (trimmed.includes(";")) {
        return "Error: Multiple statements are not allowed.";
    }

    return await db.run(sql.raw(trimmed));
}
