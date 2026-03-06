import { groq } from "@ai-sdk/groq"
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai"
import { z } from 'zod'
import { dbTool, schemaTool } from "./tools";

export const maxDuration = 30

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.
    You have access to following tool: 
    - 1 schema tool : call this tool  to get the database schema which will help to write proper SQL queries
    - 2 db tool : call this tool to query the database and get results. 
    Rules:
        1. Generate ONLY SELECT SQL queries to answer the user's question. NEVER generate any other type of SQL query (like INSERT, UPDATE, DELETE, DROP, TRUNCATE etc.).
        2. Always use the schema tool to get the database schema before generating SQL queries, and use the db tool to execute the generated SQL queries and get results to answer the user's question.
        3. Pass in valid SQL syntax in db tool.
        4. IMPORTANT- To query database call db tool. Don't return just SQL query.
    Always respond in a helpful, conversational tone while being technically accurate.
    Current Date and Time - ${new Date().toLocaleString("sv-SE")}
    `

    const result = streamText({
        model: groq("llama-3.3-70b-versatile"),
        messages: await convertToModelMessages(messages),
        system: SYSTEM_PROMPT,
        stopWhen: stepCountIs(5),
        tools: {
            schema: tool({
                description: "Call this tool to get the database schema.",
                inputSchema: z.object({}),
                execute: schemaTool,
            }),
            db: tool({
                description: "Call this tool to query a database.",
                inputSchema: z.object({
                    query: z.string().describe("The SQL query to run against the database")
                }),
                execute: dbTool,
            }),
        },
        toolChoice: 'auto'
    })

    return result.toUIMessageStreamResponse()
}