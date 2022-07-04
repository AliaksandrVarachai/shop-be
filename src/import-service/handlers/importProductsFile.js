import aws from 'aws-sdk';
import path from 'path';
import commonHeaders from './helpers/commonHeaders.js';

const { S3_NAME, S3_REGION, S3_UPLOADED_PATH } = process.env;
const s3 = new aws.S3({ region: S3_REGION });

export default async (event) => {
  const { name: filename } = event.queryStringParameters;
  const params = {
    Bucket: S3_NAME,
    Key: path.join(S3_UPLOADED_PATH, filename),
    Expires: 900,
    ContentType: 'text/csv',
  };
  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    console.log('importProductsFile signedUrl=', signedUrl)
    const response = {
      headers: {
        ...commonHeaders,
        'Content-Type': 'text/plain',
      },
      statusCode: 200,
      body: signedUrl,
    }
    return response;
  } catch(error) {
    return {
      headers: commonHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: { message: 'Server error' }
      }),
    };
  }
};
