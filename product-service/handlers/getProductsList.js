import productsList from './productsList.json';

export default async (event) => {
  return {
    statusCode: 200,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Credentials': true,
    // },
    body: JSON.stringify(productsList),
  };
};
