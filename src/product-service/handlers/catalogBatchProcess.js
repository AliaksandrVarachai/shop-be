import aws from 'aws-sdk';
import { createProducts } from '../services/index.js';
import { logError, logSuccess } from '../loggers/index.js';

const { REGION, SNS_ARN } = process.env;

// polls data from SQS and saves it to DB + SNS
export default async (event, context) => {
  const sns = new aws.SNS({ region: REGION });
  const products = event.Records.map(record => JSON.parse(record.body));
  try {
    // TODO: replace with batch of products creation
    await Promise.all(products.map(product => createProducts(product)));
    const PublishBatchRequestEntries = products.map(({ title }) => ({
      Id: title,
      Subject: 'Product is created',
      Message: `Product "${title}" is added to DB successfully`,
      MessageAttributes: {
        category: {
          DataType: 'String',
          StringValue: 'info',
        },
      }
    }));
    await sns.publishBatch({
      PublishBatchRequestEntries,
      TopicArn: SNS_ARN
    }).promise();
    logSuccess(event, context);
    return {
      statusCode: 200
    }
  } catch (error) {
    await sns.publish({
      Subject: 'Product creation failed',
      Message: `Products failed to be added to DB:\n${JSON.stringify(products, null, 4)}\n${error.message}`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        category: {
          DataType: 'String',
          StringValue: 'error',
        }
      }
    }).promise();
    logError(event, context, error.message);
    return {
      statusCode: 500
    }
  }
};
