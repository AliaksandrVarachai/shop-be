import aws from 'aws-sdk';
import path from 'path';
import commonHeaders from './helpers/commonHeaders.js';
import { logError, logSuccess } from '../loggers/index.js';

const { S3_NAME, S3_REGION, S3_UPLOADED_PATH } = process.env;

export default async (event, context) => {
  const s3 = new aws.S3({ region: S3_REGION }); // inside the handler to mock in tests

  if (!event.queryStringParameters?.name) {
    const message = 'No required query parameters';
    const response = {
      headers: commonHeaders,
      statusCode: 400,
      body: JSON.stringify({
        error: { message }
      }),
    };
    logError(event, context, message);
    return response;
  }

  try {
    const { name: filename } = event.queryStringParameters;
    const params = {
      Bucket: S3_NAME,
      Key: path.join(S3_UPLOADED_PATH, filename),
      Expires: 900,
      ContentType: 'text/csv',
    };
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    const response = {
      headers: {
        ...commonHeaders,
        'Content-Type': 'text/plain',
      },
      statusCode: 200,
      body: signedUrl,
    }
    logSuccess(event, context);
    return response;
  } catch(error) {
    const message = 'Server error';
    const response = {
      headers: commonHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: { message }
      }),
    };
    logError(event, context, message);
    return response;
  }
};
