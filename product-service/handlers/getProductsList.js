import { getProductsList } from '../services/index.js';
import commonHeaders from './commonHeaders.js';

export default async () => {
  try {
    const productsList = await getProductsList();
    return {
      headers: commonHeaders,
      statusCode: 200,
      body: JSON.stringify(productsList),
    };
  } catch (error) {
    return {
      headers: commonHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: { message: error.message }
      }),
    };
  }
};
