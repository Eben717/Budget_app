import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
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

app.use('/api/transactions', transactionsRoute);
app.use('/api/transactions/summary', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
  });
});     

