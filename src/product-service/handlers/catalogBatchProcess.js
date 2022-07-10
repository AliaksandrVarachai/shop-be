import aws from 'aws-sdk';
import { createProducts } from '../services/index.js';

const { REGION, SNS_ARN } = process.env;

// polls data from SQS and saves it to DB + SNS
export default async (event, context) => {
  const sns = new aws.SNS({ region: REGION });
  const products = event.Records.map(record => JSON.parse(record.body));
  try {
    // TODO: replace with batch of products creation
    await Promise.all(products.map(product => createProducts(product)));
    console.log('Products are created in DB:', products.map(({ title }) => title));
    const PublishBatchRequestEntries = products.map(({ title }) => ({
      Id: title,
      Subject: 'Product is created',
      Message: `Product "${title}" is added to DB successfully`,
    }));
    await sns.publishBatch({
      PublishBatchRequestEntries,
      TopicArn: SNS_ARN
    });
    return {
      statusCode: 200
    }
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500
    }
  }
};
