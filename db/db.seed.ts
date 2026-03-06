
import { db } from "./db";
import { productTable, salesTable } from "./schema";

export async function seed() {
    console.log("🌱 Seeding database...");

    // PRODUCTS
    await db.insert(productTable).values([
        { name: "Laptop", category: "Electronics", price: 999.99, stock: 50 },
        { name: "Mouse", category: "Electronics", price: 25.99, stock: 200 },
        { name: "Keyboard", category: "Electronics", price: 75.0, stock: 150 },
        { name: "Monitor", category: "Electronics", price: 299.99, stock: 75 },
        { name: "Desk Chair", category: "Furniture", price: 199.99, stock: 40 },
        { name: "Desk", category: "Furniture", price: 399.99, stock: 30 },
        { name: "Notebook", category: "Stationery", price: 5.99, stock: 500 },
        { name: "Pen Set", category: "Stationery", price: 12.99, stock: 300 },
        { name: "Office Lamp", category: "Furniture", price: 49.99, stock: 120 },
        { name: "Tablet", category: "Electronics", price: 499.99, stock: 60 },
    ]);

    // SALES
    await db.insert(salesTable).values([
        {
            product_id: 1,
            quantity: 2,
            total_amount: 1999.98,
            customer_name: "John Smith",
            region: "North America",
        },
        {
            product_id: 2,
            quantity: 5,
            total_amount: 129.95,
            customer_name: "Alice Johnson",
            region: "Europe",
        },
        {
            product_id: 3,
            quantity: 3,
            total_amount: 225,
            customer_name: "Michael Brown",
            region: "Asia",
        },
        {
            product_id: 4,
            quantity: 1,
            total_amount: 299.99,
            customer_name: "Emily Davis",
            region: "North America",
        },
        {
            product_id: 5,
            quantity: 2,
            total_amount: 399.98,
            customer_name: "Robert Wilson",
            region: "Europe",
        },
        {
            product_id: 6,
            quantity: 1,
            total_amount: 399.99,
            customer_name: "Sophia Martinez",
            region: "South America",
        },
        {
            product_id: 7,
            quantity: 20,
            total_amount: 119.8,
            customer_name: "Daniel Anderson",
            region: "Asia",
        },
        {
            product_id: 8,
            quantity: 10,
            total_amount: 129.9,
            customer_name: "Olivia Taylor",
            region: "Europe",
        },
        {
            product_id: 9,
            quantity: 4,
            total_amount: 199.96,
            customer_name: "James Thomas",
            region: "North America",
        },
        {
            product_id: 10,
            quantity: 2,
            total_amount: 999.98,
            customer_name: "Lucas White",
            region: "Australia",
        },

        // Additional sales for analytics
        {
            product_id: 1,
            quantity: 1,
            total_amount: 999.99,
            customer_name: "Emma Harris",
            region: "Europe",
        },
        {
            product_id: 2,
            quantity: 7,
            total_amount: 181.93,
            customer_name: "William Clark",
            region: "Asia",
        },
        {
            product_id: 3,
            quantity: 4,
            total_amount: 300,
            customer_name: "Benjamin Lewis",
            region: "North America",
        },
        {
            product_id: 4,
            quantity: 2,
            total_amount: 599.98,
            customer_name: "Mia Walker",
            region: "Europe",
        },
        {
            product_id: 5,
            quantity: 1,
            total_amount: 199.99,
            customer_name: "Charlotte Hall",
            region: "Asia",
        },
        {
            product_id: 6,
            quantity: 2,
            total_amount: 799.98,
            customer_name: "Henry Allen",
            region: "North America",
        },
        {
            product_id: 7,
            quantity: 50,
            total_amount: 299.5,
            customer_name: "David Young",
            region: "South America",
        },
        {
            product_id: 8,
            quantity: 15,
            total_amount: 194.85,
            customer_name: "Ava King",
            region: "Europe",
        },
        {
            product_id: 9,
            quantity: 3,
            total_amount: 149.97,
            customer_name: "Alexander Scott",
            region: "Asia",
        },
        {
            product_id: 10,
            quantity: 1,
            total_amount: 499.99,
            customer_name: "Ethan Green",
            region: "Australia",
        },
    ]);

    console.log("✅ Seeding completed");
}

seed().catch((error) => {
    console.error("Error seeding database:", error);
});