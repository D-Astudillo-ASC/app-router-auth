import { insertUser } from '@/drizzle/db';
import { NewUser } from '@/drizzle/schema';
import bcrypt from 'bcrypt';

async function main() {
  const newUser: NewUser = {
    name: 'user',
    email: 'user@example.com',
    password: await bcrypt.hash('123456', 10),
  };
  const res = await insertUser(newUser);
  console.log('Sucessfully seeded users table:', res);
  process.exit();
}

main();
