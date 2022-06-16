import productsList from './productsList.json';

export default async (event) => {
  const { productId } = event.pathParameters;
  const product = productsList.find(product => product.id === productId);

  return product
    ? {
      statusCode: 200,
      body: JSON.stringify(product),
    }
    : {
      statusCode: 404,
      body: JSON.stringify({
        error: {
          message: 'Product is not found',
        },
      }),
    };
};
