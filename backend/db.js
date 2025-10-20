import {neon} from "@neondatabase/serverless-client";

import "dotenv/config";

// creates function for sql queries
export const sql = neon(process.env.DATABASE_URL);