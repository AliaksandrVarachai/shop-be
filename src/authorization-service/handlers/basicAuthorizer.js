const generatePolicy = (principalId, resource, effect = 'Deny') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

export default async (event) => {
  if (event.type !== 'TOKEN') throw Error('Unauthorized');

  const { authorizationToken } = event;
  const encodedCredentials = authorizationToken.split(' ')[1];
  const buffer = Buffer.from(encodedCredentials, 'base64');
  const [userName, password] = buffer.toString('utf8').split(':');
  const storedUserPassword = process.env[userName];
  const effect = storedUserPassword && storedUserPassword === password ? 'Allow' : 'Deny';

  return generatePolicy(encodedCredentials, event.methodArn, effect);
};
