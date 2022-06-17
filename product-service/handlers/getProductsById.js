import productsList from './productsList.json';
import commonHeaders from './commonHeaders.js';

export default async (event) => {
  const { productId } = event.pathParameters;
  const product = productsList.find(product => product.id === productId);

  return product
    ? {
      headers: commonHeaders,
      statusCode: 200,
      body: JSON.stringify(product),
    }
    : {
      headers: commonHeaders,
      statusCode: 404,
      body: JSON.stringify({
        error: {
          message: 'Product is not found',
        },
      }),
    };
};
