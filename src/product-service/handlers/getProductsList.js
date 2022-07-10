import { getProductsList } from '../services/index.js';
import commonHeaders from './helpers/commonHeaders.js';
import { logError, logSuccess } from '../loggers/index.js';

export default async (event, context) => {
  try {
    const productsList = await getProductsList();
    const response = {
      headers: commonHeaders,
      statusCode: 200,
      body: JSON.stringify(productsList),
    };
    logSuccess(event, context);
    return response;
  } catch (error) {
    const response = {
      headers: commonHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: { message: error.message }
      }),
    };
    logError(event, context, error.message);
    return response;
  }
};
