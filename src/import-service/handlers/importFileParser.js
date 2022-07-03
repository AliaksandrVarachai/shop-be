import aws from 'aws-sdk';
import csvParser from 'csv-parser';

const { S3_NAME, S3_REGION, S3_UPLOADED_PATH, S3_PARSED_PATH } = process.env;

export default async (event) => {
  const s3 = new aws.S3({ region: S3_REGION });
  try {
    for (const record of event.Records) {
      const s3ObjectKey = record.s3.object.key;
      const params = {
        Bucket: S3_NAME,
        Key: s3ObjectKey,
      };
      const s3Stream = s3.getObject(params).createReadStream();
      console.log(`Parsing of ${s3ObjectKey} is started`);
      s3Stream
        .pipe(csvParser())
        .on('data', (data) => {
          console.log(`Parsing of ${s3ObjectKey} is started`);
        })
        .on('end', () => {
          console.log(`${s3ObjectKey} is parsed successfully`);
        })
        .on('error', (error) => {
          console.error(error);
        });

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
    }
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 202,
  }
};
