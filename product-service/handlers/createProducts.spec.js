import createProducts from './createProducts.js';
import * as services from '../services/index.js';

jest.mock('./helpers/commonHeaders.js', () => ({}));

jest.mock('../services/index.js', () => ({
  createProducts: jest.fn(),
}));

const creatingProduct = {
  title: 'title-1',
  description: 'description-1',
  price: 99,
  count: 10,
};

describe('createProducts', () => {
  it('should return 200 status code if a product is created', async () => {
    const event = {
      body: JSON.stringify(creatingProduct),
    };
    const fakeCreatedProduct = { id: 'id-1' };
    services.createProducts.mockImplementation(async () => fakeCreatedProduct);
    const response = await createProducts(event);
    expect(response).toMatchObject({
      statusCode: 200,
      body: expect.any(String)
    });
  });

  it('should return 400 status code if product data is incorrect', async () => {
    const productWithWrongData = {
      title: 'title-1',
      description: 'description-1',
      price: -555,
      count: 10,
    }
    const event = {
      body: JSON.stringify(productWithWrongData),
    };
    const fakeCreatedProduct = { id: 'id-1' };
    services.createProducts.mockImplementation(async () => fakeCreatedProduct);
    const response = await createProducts(event);
    expect(response).toMatchObject({
      statusCode: 400,
      body: expect.any(String)
    });
  });

  it('should return 500 status code if an unhandled error happens', async () => {
    const event = {
      body: JSON.stringify(creatingProduct),
    };
    services.createProducts.mockImplementation(async () => {
      throw Error('Error message');
    });
    const response = await createProducts(event);
    expect(response).toMatchObject({
      statusCode: 500,
      body: expect.any(String)
    });
  });
});
