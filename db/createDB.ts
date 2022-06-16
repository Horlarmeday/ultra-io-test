const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({});
const client = new Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.DB_PORT,
});

async function initialize() {
  try {
    await client.connect();

    await client.query(`CREATE DATABASE ${process.env.POSTGRES_DB};`);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.end();
  }
}

initialize().then((result) => {
  if (result) {
    console.log('Database created');
  }
});
