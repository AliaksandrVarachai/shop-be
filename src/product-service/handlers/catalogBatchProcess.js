import aws from 'aws-sdk';
import { createMultipleProducts, createProducts } from '../services/index.js';
import { logError, logSuccess } from '../loggers/index.js';

const { REGION, SNS_ARN } = process.env;

// polls data from SQS and saves it to DB + SNS
export default async (event, context) => {
  const sns = new aws.SNS({ region: REGION });
  try {
    const products = event.Records.map(record => JSON.parse(record.body));
    const values = await Promise.allSettled(products.map(product => createProducts(product)));
    for (let i = 0; i < products.length; ++i) {
      const { status, reason } = values[i];
      const product = products[i];
      if (status === 'fulfilled') {
        await sns.publish({
          Subject: 'Product is created',
          Message: `Product "${product.title}" is added to DB successfully`,
          TopicArn: SNS_ARN,
          MessageAttributes: {
            category: {
              DataType: 'String',
              StringValue: 'info',
            }
          },
        }).promise();
      } else {
        await sns.publish({
          Subject: 'Product creation failed',
          Message: `Product failed to be added to DB:\n${JSON.stringify(product, null, 4)}\nReason: ${reason}`,
          TopicArn: SNS_ARN,
          MessageAttributes: {
            category: {
              DataType: 'String',
              StringValue: 'warn',
            }
          },
        }).promise();
      }
    }
    return {
      statusCode: 200
    }
  } catch (error) {
    const recordBodies = event.Records.map(record => record.body).join('\n');
    await sns.publish({
      Subject: 'Error during creation of products',
      Message: `Products failed to be added to DB. Records bodies:\n${recordBodies}\nReason: ${error.message}`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        category: {
          DataType: 'String',
          StringValue: 'error',
        }
      },
    }).promise();
    logError(event, context, error.message);
    return {
      statusCode: 500
    }
  }
};
