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
