import {neon} from "@neondatabase/serverless";

import "dotenv/config";

// creates function for sql queries
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_DATE
        )`;

        console.log('Database Initialized Successfully');
} catch (error) {
    console.log('Error Initializing Database:', error);
    }
}


export default sql;