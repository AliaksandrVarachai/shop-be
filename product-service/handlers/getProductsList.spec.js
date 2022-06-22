import getProductsList from './getProductsList';
import * as services from '../services/index.js';

jest.mock('./helpers/commonHeaders.js', () => ({}));

jest.mock('../services/index.js', () => ({
  getProductsList: jest.fn(),
}));


jest.mock('./helpers/commonHeaders.js', () => ({}));

describe('getProductsList', () => {
  it ('should return 200 status code if list is available', async () => {
    services.getProductsList.mockImplementation(async () => [
      { id: 'id-1' },
      { id: 'id-2' },
    ]);
    const response = await getProductsList();
    expect(response).toMatchObject({
      statusCode: 200,
      body: expect.any(String),
    });
  });

  it ('should return 500 status code if an unhandled error happens', async () => {
    services.getProductsList.mockImplementation(async () => {
      throw Error('Error message');
    });
    const response = await getProductsList();
    expect(response).toMatchObject({
      statusCode: 500,
      body: expect.any(String),
    });
  });
});
