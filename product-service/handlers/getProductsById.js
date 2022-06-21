// import productsList from '../mocks/productsList.json';
import commonHeaders from './commonHeaders.js';
import { getProductsById } from '../services/index.js';

export default async (event) => {
  const { productId } = event.pathParameters;
  try {
    const products = await getProductsById(productId);
    return products.length > 0
      ? {
        headers: commonHeaders,
        statusCode: 200,
        body: JSON.stringify(products[0]),
      }
      : {
        headers: commonHeaders,
        statusCode: 404,
        body: JSON.stringify({
          error: { message: 'Product not found' }
        }),
      };
  } catch (error) {
    return {
      headers: commonHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: { message: error.message }
      }),
    };
  }
};
