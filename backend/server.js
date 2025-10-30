import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

import transactionsRoute from './routes/transactionsRoute.js';

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

app.get('/', (req, res) => {
    res.send('its working');
});

app.use('/api/transactions', transactionsRoute);
app.use('/api/transactions/summary', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
  });
});     

