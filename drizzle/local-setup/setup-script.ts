import { createTables, closePool } from '../db'; // Adjust the path as necessary

async function setup() {
  await createTables(); // Create the tables
  await closePool(); // Close the pool after the setup is complete
  process.exit();
}

setup()
  .then(() => console.log('Setup completed'))
  .catch((err) => console.error('Setup failed:', err));
