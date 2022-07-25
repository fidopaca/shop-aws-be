import { Client, ClientConfig } from "pg";
import { Stock } from "../types/stock";
import { CreateProductDTO, Product } from "../types/product";


// connect to aws postgres db
function getClient() {
  const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
  const options: ClientConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  return new Client(options);
}

export async function getAll(): Promise<Product[]> {
  const client = getClient();
  await client.connect();

  const query = `
    SELECT id, title, description, price, count
    FROM products p
    LEFT JOIN stocks s 
    ON p.id = s.product_id 
  `;

  try {
    const { rows: products } = await client.query(query);
    return products;
  } catch (error) {
    console.log("Database Error ===> ", error);
    throw error;
  } finally {
    client.end();
  }
}

export async function getById(productId: string): Promise<Product> {
  const client = getClient();
  await client.connect();

  const query = `
    SELECT p.*, s."count"
    FROM products p
    JOIN stocks s ON p.id = s.product_id AND p.id = $1;
  `;
  try {
    const { rows: products } = await client.query(query, [productId]);

    return products[0];
  } catch (error) {
    console.log("Database Error ===> ", error);
    throw error;
  } finally {
    client.end();
  }
}

export async function createOne({ title, description, price, count }: CreateProductDTO): Promise<Product> {
  const client = getClient();
  await client.connect();

  const createProductQuery = `
    INSERT INTO products (title, description, price) VALUES
    ($1, $2, $3)
	  RETURNING *;
  `;
  const createStockQuery = `
	  INSERT INTO stocks (product_id, count) VALUES
	  ($1, $2)
	  RETURNING *;
  `;

  try {
    await client.query("BEGIN");

    const { rows: productRows } = await client.query<Product>(createProductQuery, [title, description, price]);
    const product: Product = productRows[0];

    const { rows: stockRows } = await client.query<Stock>(createStockQuery, [product.id, count]);
    const stock: Stock = stockRows[0];

    await client.query("COMMIT");
    return { ...product, count: stock.count };
  } catch (error) {
    console.log("Database Error ===> ", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.end();
  }
}
