import aws from 'aws-sdk';
import path from 'path';
import commonHeaders from './helpers/commonHeaders.js';

const { BUCKET, S3_REGION, S3_UPLOADED_PATH } = process.env;
const s3 = new aws.S3({ region: S3_REGION });

export default async (event) => {
  console.log('importProductsFile event=', event)
  const { name: filename } = event.queryStringParameters;
  const params = {
    Bucket: BUCKET,
    Key: path.join(S3_UPLOADED_PATH, filename),
    Expires: 60,
    ContentType: 'text/csv',
  };
  console.log('importProductsFile params=', params)
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
