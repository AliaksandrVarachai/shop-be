import getProductsById from './getProductsById.js';

jest.mock('./productsList.json', () => [
  { id: 'id-1' },
  { id: 'id-2' },
]);

describe('getProductsById', () => {
  it('should return body with status code 200', async () => {
    const event = {
      pathParameters: {
        productId: 'id-1'
      }
    };
    const response = await getProductsById(event);
    expect(response).toMatchObject({
      statusCode: 200,
      body: expect.any(String)
    });
  });

  it('should return an error with status code 404', async () => {
    const event = {
      pathParameters: {
        productId: 'id-missing-in-product-list'
      }
    };
    const response = await getProductsById(event);
    expect(response).toMatchObject({
      statusCode: 404,
      body: expect.any(String)
    });

  });
});
