import awsMock from 'aws-sdk-mock';
import catalogBatchProcess from './catalogBatchProcess.js';
import * as services from '../services/index.js';

const mockSnsPublish = (_1, cb) => {
  cb(null, {});
};

// See https://github.com/dwyl/aws-sdk-mock/issues/197#issuecomment-643438859
awsMock.mock('SNS', 'publish', mockSnsPublish);

jest.mock('../services/index.js', () => ({
  createProducts: jest.fn(),
}));

jest.mock('../loggers/index.js', () => ({
  logSuccess: jest.fn(),
  logError: jest.fn(),
}));

const product1 = { title: 'title-1' };
const product2 = { title: 'title-2' };
const sqsEvent = {
  Records: [
    { body: JSON.stringify(product1) },
    { body: JSON.stringify(product2) },
  ],
};

describe('catalogBatchProcess', () => {
  it('should return 200 status code if products are created', async () => {
    services.createProducts.mockImplementation(async () => []);
    const response = await catalogBatchProcess(sqsEvent);
    expect(response).toMatchObject({
      statusCode: 200,
    });
  });

  it('should return 200 status code if a product are NOT created, but SNS notification is sent', async () => {
    services.createProducts.mockImplementation(async () => {
      throw Error('Error message');
    });
    const response = await catalogBatchProcess(sqsEvent);
    expect(response).toMatchObject({
      statusCode: 200,
    });
  });

  it('should return 500 status code if an unhandled error happens', async () => {
    const incorrectEvent = {
      Records: [{ body: undefined }],
    };
    services.createProducts.mockImplementation(async () => []);
    const response = await catalogBatchProcess(incorrectEvent);
    expect(response).toMatchObject({
      statusCode: 500,
    });
  });
});
