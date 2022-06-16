import productsList from './productsList.json';

export default async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(productsList),
  };
};
