import aws from 'aws-sdk';
import csvParser from 'csv-parser';
import commonHeaders from './helpers/commonHeaders.js';

const { S3_NAME, S3_REGION, S3_UPLOADED_PATH, S3_PARSED_PATH } = process.env;

export default async (event) => {
  const s3 = new aws.S3({ region: S3_REGION });

  return new Promise((resolve, reject) => {
    const handleError = (error) => {
      console.error(error);
      reject({
        headers: commonHeaders,
        error: { message: error.message }
      });
    };

    for (const record of event.Records) {
      const s3ObjectKey = record.s3.object.key;
      const params = {
        Bucket: S3_NAME,
        Key: s3ObjectKey,
      };
      const s3Stream = s3.getObject(params).createReadStream();
      console.log(`Parsing of ${s3ObjectKey} is started`);
      s3Stream
        .on('error', (error) => { handleError(error); })
        .pipe(csvParser())
        .on('data', (data) => {
          const parsedData = Object.entries(data).map(([key, value]) => `${key}:${value}`).join(';');
          console.log(`Parsed ${parsedData}`);
        })
        .on('end', () => {
          console.log(`${s3ObjectKey} is parsed successfully`);

          (async () => {
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

            resolve({
              statusCode: 202,
            });
          })();
        })
        .on('error', (error) => { handleError(error); });
    }
  });
};
