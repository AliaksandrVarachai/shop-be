import awsMock from 'aws-sdk-mock';
import importProductsFile from './importProductsFile.js';

const mockS3GetSignedUrl = (_1, _2, cb) => {
  cb(null, 'https://signed-url-for-test');
};

// See https://github.com/dwyl/aws-sdk-mock/issues/197#issuecomment-643438859
awsMock.mock('S3', 'getSignedUrl', mockS3GetSignedUrl);

jest.mock('./helpers/commonHeaders.js', () => ({}));

jest.mock('../loggers/index.js', () => ({
  logSuccess: jest.fn(),
  logError: jest.fn(),
}));

const event = {
  queryStringParameters: {
    name: 'test.csv',
  },
};

describe('importProductsFile', () => {
  afterAll(() => {
    awsMock.restore('S3');
  });

  it('should return 200 status code if a signed URL is created', async () => {
    const response = await importProductsFile(event);
    expect(response).toMatchObject({
      statusCode: 200,
      body: expect.any(String)
    });
  });

  it('should return 400 status code if there are not required query string parameters', async () => {
    const incorrectEvent = {};
    const response = await importProductsFile(incorrectEvent);
    expect(response).toMatchObject({
      statusCode: 400,
      body: expect.any(String)
    });
  });

  it('should return 500 status code if an unhandled error happened', async () => {
    const mockS3GetSignedUrlThrowsError = (_1, _2, cb) => {
      cb('Error happened');
    };
    awsMock.remock('S3', 'getSignedUrl', mockS3GetSignedUrlThrowsError);
    const response = await importProductsFile(event);
    expect(response).toMatchObject({
      statusCode: 500,
      body: expect.any(String)
    });
    awsMock.remock('S3', 'getSignedUrl', mockS3GetSignedUrl);
  });
});
