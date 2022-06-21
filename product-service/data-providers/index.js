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
