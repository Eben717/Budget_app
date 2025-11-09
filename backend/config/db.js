import {neon} from "@neondatabase/serverless";

import "dotenv/config";

// creates function for sql queries
export const sql = neon(process.env.DATABASE_URL);

export default sql;