import { getProductsById } from '../services/index.js';
import commonHeaders from './helpers/commonHeaders.js';
import { logError, logSuccess } from '../loggers/index.js';

export default async (event, context) => {
  const { productId } = event.pathParameters;
  try {
    const products = await getProductsById(productId);
    if (products.length > 0) {
      const response = {
        headers: commonHeaders,
        statusCode: 200,
        body: JSON.stringify(products[0]),
      };
      logSuccess(event, context);
      return response;
    }
    const message = 'Product not found';
    const response = {
      headers: commonHeaders,
      statusCode: 404,
      body: JSON.stringify({
        error: { message }
      }),
    };
    logError(event, context, message);
    return response;
  } catch (error) {
    const response = {
      headers: commonHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: { message: error.message }
      }),
    };
    logError(event, context, error.message);
    return response;
  }
};
