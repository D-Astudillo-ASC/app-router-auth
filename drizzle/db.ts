import '@/drizzle/envConfig'; // Import your environment configuration
import { drizzle } from 'drizzle-orm/node-postgres'; // Make sure this import is correct for your setup
import { Pool } from 'pg'; // Import Pool from pg
import { promises as fs } from 'fs';
import path from 'path';
import { users, NewUser } from './schema';
import * as schema from './schema';

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Use your connection string
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close clients after 30 seconds of inactivity
});

// Initialize Drizzle ORM with the PostgreSQL connection pool and your schema
export const db = drizzle(pool, { schema });

// Function to insert a new user into the database
export const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user).returning(); // Insert the user and return the inserted data
};

// Function to create the users table from a setup SQL file
export const createTables = async () => {
  const client = await pool.connect();
  try {
    const sqlFilePath = path.join(__dirname, 'local-setup/create_tables.sql'); // Adjust path as necessary
    const sql = await fs.readFile(sqlFilePath, 'utf8'); // Read SQL file
    await client.query(sql); // Execute the SQL
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
};

// Optional: You can also add a function to close the pool if needed
export const closePool = async () => {
  await pool.end(); // Close all connections in the pool
};
