import aws from 'aws-sdk';
import csvParser from 'csv-parser';

const { S3_NAME, S3_REGION, S3_UPLOADED_PATH, S3_PARSED_PATH, SQS_URL } = process.env;

export default async (event) => {
  const s3 = new aws.S3({ region: S3_REGION });
  const sqs = new aws.SQS();

  const s3GetObjectPromise = (record) => new Promise((resolve, reject) => {
    const s3ObjectKey = record.s3.object.key;
    const params = {
      Bucket: S3_NAME,
      Key: s3ObjectKey,
    };
    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream
      .on('error', reject)
      .pipe(csvParser())
      .on('data', async (product) => {
        await sqs.sendMessage({
          QueueUrl: SQS_URL,
          MessageBody: JSON.stringify(product),
        }).promise();
        console.log(`Parsed product is sent to SQS`, product);
      })
      .on('end', async () => {
        await s3.copyObject({
          Bucket: S3_NAME,
          CopySource: `${S3_NAME}/${s3ObjectKey}`,
          Key: s3ObjectKey.replace(S3_UPLOADED_PATH, S3_PARSED_PATH),
        }).promise();

        await s3.deleteObject({
          Bucket: S3_NAME,
          Key: s3ObjectKey,
        }).promise();
        console.log(`${s3ObjectKey} is successfully moved from ${S3_UPLOADED_PATH} to ${S3_PARSED_PATH}`);
        resolve();
      })
      .on('error', reject);
  });

  await Promise.allSettled(event.Records.map(s3GetObjectPromise));
};
