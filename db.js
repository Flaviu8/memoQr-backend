import pg from "pg"
const { Pool }= pg
import * as dotenv from 'dotenv'
dotenv.config() 


export const pool = new Pool({
    database: "qr",
    user: "postgres",
    password: "flaviu8",
    port: 5432,
    localhost: "localhost",
    
  })

