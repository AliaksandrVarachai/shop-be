import { createProducts } from '../services/index.js';
import commonHeaders from './helpers/commonHeaders.js';

export default async (event) => {
  const { title, description, price, count } = JSON.parse(event.body);
  if (!title || typeof title !== 'string' || typeof description !== 'string'
    || typeof price !== 'number' || price < 0 || typeof count !== 'number' || count < 0) {
    const payloadErrorMessage = `Wrong data. Requirements: 
title is not empty string,
description is string,
price is number,
count is number.`
    return {
      headers: commonHeaders,
      statusCode: 400,
      body: JSON.stringify({
        error: { message: payloadErrorMessage }
      }),
    };
  }

  try {
    const createdProduct = await createProducts({ title, description, price, count });
    return {
      headers: commonHeaders,
      statusCode: 200,
      body: JSON.stringify(createdProduct),
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
