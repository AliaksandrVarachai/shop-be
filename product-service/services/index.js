import * as dataProviders from '../data-providers/index.js';

/**
 * Provides list of products.
 * @returns {Promise<[{ id, title, description, price, count }]>}
 * @throws Will throw an error message form dataProvider
 */
export const getProductsList = async () => {
  const productsList = await dataProviders.getProductsList();
  return productsList.map(({ product_id, title, description, price, count }) => ({
    id: product_id,
    title,
    description,
    price,
    count: Number(count),
  }));
};

/**
 * Provides list of products with given their ID.
 * @param productId {string} - required ID.
 * @returns {Promise<[{ id, title, description, price, count }]>}
 * @throws Will throw an error message form dataProvider
 */
export const getProductsById = async (productId) => {
  const products = await dataProviders.getProductsById(productId);
  return products.map(({ product_id, title, description, price, count }) => ({
    id: product_id,
    title,
    description,
    price,
    count: Number(count),
  }));
};

/**
 * Creates a new product and puts it in a stock.
 * @param title {string} - title of a product.
 * @param description {string} - description of a product.
 * @param price {number} - price of a product.
 * @param count {number} - number of products in a stock.
 * @returns {Promise<{ productId, title, description, price, stockId, count }>}
 * @throws Will throw an error message form dataProvider
 */
export const createProducts = async ({ title, description, price, count }) => {
  const product = await dataProviders.createProducts({ title, description, price, count });
  return {
    productId: product.product_id,
    title: product.title,
    description: product.description,
    price: product.price,
    stockId: product.stock_id,
    count: product.count,
  };
};
