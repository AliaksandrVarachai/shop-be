import productsList from './productsList.json';

const commonResponse = {
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': true,
  }
}

export default async (event) => {
  const { productId } = event.pathParameters;
  const product = productsList.find(product => product.id === productId);

  return product
    ? {
      ...commonResponse,
      statusCode: 200,
      body: JSON.stringify(product),
    }
    : {
      ...commonResponse,
      statusCode: 404,
      body: JSON.stringify({
        error: {
          message: 'Product is not found',
        },
      }),
    };
};
