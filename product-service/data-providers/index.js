import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  connectionTimeoutMillis: 5000,
};

export const getProductsList = async () => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const result = await client.query(
      `
        SELECT
          product_id,
          p.title,
          p.description,
          p.price,
          SUM(s.count) as count
        FROM products as p JOIN stocks as s USING (product_id)
        GROUP BY product_id
        HAVING SUM(s.count) > 0
        ORDER BY p.title;
      `
    );
    return result.rows;
  } catch (error) {
    throw(error);
  } finally {
    client.end();
  }
};

export const getProductsById = async (productId) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const result = await client.query(
      `
        WITH all_stocks as (
          SELECT count FROM stocks WHERE product_id = $1
        )
        SELECT
          product_id,
          title,
          description,
          price,
          (SELECT sum(count) FROM all_stocks) as count
        FROM products 
        WHERE product_id = $1;
      `,
      [productId]
    );
    return result.rows;
  } catch (error) {
    throw(error);
  } finally {
    client.end();
  }
};

export const createProducts = async ({ title, description, price, count }) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    await client.query('BEGIN');
    const { rows: [{ product_id }] } = await client.query(
      `
        INSERT INTO products (title, description, price)
        VALUES ($1, $2, $3)
        RETURNING product_id;
      `,
      [title, description, price]
    );

    const { rows: [{ stock_id }] } = await client.query(
      `
        INSERT INTO stocks (product_id, count)
        VALUES ($1, $2)
        RETURNING stock_id; 
      `,
      [product_id, count]
    );
    await client.query('COMMIT');

    return {
      product_id,
      title,
      description,
      price,
      stock_id,
      count,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw(error);
  } finally {
    client.end();
  }
};
