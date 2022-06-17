import productsList from './productsList.json';
import commonHeaders from './commonHeaders.js';

export default async (event) => {
  return {
    headers: commonHeaders,
    statusCode: 200,
    body: JSON.stringify(productsList),
  };
};
