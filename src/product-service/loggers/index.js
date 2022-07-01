export const logSuccess = (event, context) => {
  const { functionName, functionVersion } = context;
  console.log(`${functionName}@${functionVersion} SUCCESS
EVENT: ${JSON.stringify(event, null, 4)}`);
};

export const logError = (event, context) => {
  const { functionName, functionVersion } = context;
  console.log(`${functionName}@${functionVersion} ERROR
EVENT: ${JSON.stringify(event, null, 4)}`);
};
