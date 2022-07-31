const { WEB_SITE_ORIGIN } = process.env;

export default {
  'Access-Control-Allow-Origin': WEB_SITE_ORIGIN,
  'Access-Control-Allow-Credentials': true,
};
