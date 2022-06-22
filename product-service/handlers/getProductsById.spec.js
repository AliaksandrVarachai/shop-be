import getProductsById from './getProductsById.js';
import * as services from '../services/index.js';

jest.mock('./helpers/commonHeaders.js', () => ({}));

jest.mock('../services/index.js', () => ({
  getProductsById: jest.fn(),
}));

describe('getProductsById', () => {
  it('should return 200 status code if a product is found', async () => {
    const event = {
      pathParameters: {
        productId: 'id-1'
      }
    };
    services.getProductsById.mockImplementation(async () => [{ id: 'id-1' }]);
    const response = await getProductsById(event);
    expect(response).toMatchObject({
      statusCode: 200,
      body: expect.any(String)
    });
  });

  it('should return 404 status code if a product is found', async () => {
    const event = {
      pathParameters: {
        productId: 'id-missing-in-product-list'
      }
    };
    services.getProductsById.mockImplementation(async () => []);
    const response = await getProductsById(event);
    expect(response).toMatchObject({
      statusCode: 404,
      body: expect.any(String)
    });
  });

  it('should return 500 status code if an unhandled error happens', async () => {
    const event = {
      pathParameters: {
        productId: 'id-1'
      }
    };
    services.getProductsById.mockImplementation(async () => {
      throw Error('Error message');
    });
    const response = await getProductsById(event);
    expect(response).toMatchObject({
      statusCode: 500,
      body: expect.any(String)
    });
  });
});
