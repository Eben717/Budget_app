import express from 'express';
import dotenv from 'dotenv';
import { sql } from './db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

async function initDB() {
    try {
        await sql
} catch (error) {
    }
}

app.get('/', (req, res) => {
    res.send ('Budget App is Working!!');
});

app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
}
);