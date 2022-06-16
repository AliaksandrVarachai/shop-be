import getProductsList from './getProductsList';

jest.mock('./productsList.json', () => [
  { id: 'id-1' },
  { id: 'id-2' },
]);

describe('getProductsList', () => {
  it ('should return a body with status code 200', async () => {
    const response = await getProductsList();
    expect(response).toMatchObject({
      statusCode: 200,
      body: expect.any(String),
    });
  });
});
