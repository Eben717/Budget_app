import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();


const app = express();

//middleware
app.use(rateLimiter);
app.use(express.json());


// our custom simple middleware
app.use((req, res, next) => {
    console.log("Hi from Middleware, we hit a request", req.method);
    next();
})

const PORT = process.env.PORT || 3001;

async function initDB() {
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

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
  });
});


app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.status(200).json(transactions);
         } catch (error) {
        console.log('Error getting the transaction:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

app.post('/api/transactions', async  (req, res) => {
    try {
        const {title, amount, category, user_id} = req.body;

        if(!title || !category || !user_id || amount === undefined) {
        return res.status(400).json({message: 'All fields are required'});
        }

        const transaction =     
        await sql`INSERT INTO transactions (title, amount, category, user_id)
        VALUES (${title}, ${amount}, ${category}, ${user_id})
        RETURNING *`;
        console.log(transaction);
        res.status(201).json(transaction[0]);


    } catch (error) {
        console.log('Error creating transaction:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const {id} = req.params;

        if(isNaN(parseInt(id))) {
        return res.status(400).json({message: 'Invalid transaction ID'});
        }

        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        if (result.length === 0) {
            return  res.status(404).json({message: 'Transaction not found'});
        }
        res.status(200).json({message: 'Transaction deleted successfully'});
    }
    catch (error) {
        console.log('Error deleting transaction:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

app.get('/api/transactions/summary/:userId', async (req, res) => {
    try {
        const {userId} = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions 
        WHERE user_id = ${userId}`

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS income FROM transactions
        WHERE user_id = ${userId} AND amount > 0`

        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions
        WHERE user_id = ${userId} AND amount < 0`

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        })

         } catch (error) {
        console.log('Error getting the summary:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})
