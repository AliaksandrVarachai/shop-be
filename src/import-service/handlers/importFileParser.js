import aws from 'aws-sdk';
import csvParser from 'csv-parser';
import { logError, logSuccess } from '../loggers/index.js';

const { S3_NAME, S3_REGION, S3_UPLOADED_PATH, S3_PARSED_PATH, SQS_URL } = process.env;

export default async (event, context) => {
  const s3 = new aws.S3({ region: S3_REGION });
  const sqs = new aws.SQS();

  const handleError = (error) => {
    console.error(error.message);
  };

  for (const record of event.Records) {
    const s3ObjectKey = record.s3.object.key;
    const params = {
      Bucket: S3_NAME,
      Key: s3ObjectKey,
    };
    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream
      .on('error', (error) => { logError(event, context, error.message); })
      .pipe(csvParser())
      .on('data', async (product) => {
        try {
          await sqs.sendMessage({
            QueueUrl: SQS_URL,
            MessageBody: JSON.stringify(product),
          }).promise();
          console.log(`Parsed product is sent to SQS`, product);
        } catch (error) {
          console.log('onData Error: ', error.message);
        }
      })
      .on('end', async () => {
        console.log(`${s3ObjectKey} is parsed successfully`);
        await s3.copyObject({
          Bucket: S3_NAME,
          CopySource: `${S3_NAME}/${s3ObjectKey}`,
          Key: s3ObjectKey.replace(S3_UPLOADED_PATH, S3_PARSED_PATH),
        }).promise();
        console.log(`${s3ObjectKey} is successfully copied to ${S3_PARSED_PATH}`);

        await s3.deleteObject({
          Bucket: S3_NAME,
          Key: s3ObjectKey,
        }).promise();
        console.log(`${s3ObjectKey} is successfully deleted from ${S3_UPLOADED_PATH}`);
      })
      .on('error', (error) => { logError(event, context, error.message); });
  }
};
