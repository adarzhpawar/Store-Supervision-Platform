import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function reset() {
  await client.connect();
  await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  console.log('Database public schema reset.');
  await client.end();
}
reset().catch(console.error);
