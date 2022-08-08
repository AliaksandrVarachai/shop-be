import path from 'path';
import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const recipientServiceNames = {
  product: 'PRODUCT_SERVICE',
  cart: 'CART_SERVICE',
};

// Adds recipientUrl to the request
const recipientUrlMiddleware = (req, res, next) => {
  const originalUrl = new URL(req.originalUrl, 'https://fake.com')
  const [, recipient, ...afterRecipientPathnames] = originalUrl.pathname.split('/');
  const recipientServiceName = recipientServiceNames[recipient];
  if (!recipientServiceName) {
    const listOfAvailableServiceNames = `'${Object.keys(recipientServiceNames).join("', '")}'`;
    return res.status(502).json({
      error: `Wrong service name '${recipient}' is provided. Available service names: ${listOfAvailableServiceNames}`,
    });
  }
  if (!process.env[recipientServiceName]) {
    return res.status(500).json({ error: `Environment variable "${recipientServiceName}" must contain a service URL` });
  }

  const recipientUrl = new URL(process.env[recipientServiceName]);
  recipientUrl.pathname = path.join(recipientUrl.pathname, ...afterRecipientPathnames);
  recipientUrl.search = originalUrl.search;
  req.recipientUrl = recipientUrl.toString();
  next();
};

app.use(recipientUrlMiddleware);

app.all('/*', async (req, res) => {
  const isBody = Object.keys(req.body || {}).length > 0;
  const axiosRequest = {
    method: req.method,
    url: req.recipientUrl,
    ...(isBody && req.body)
  };
  try {
    const axiosResponse = await axios(axiosRequest);
    res.json(axiosResponse.data);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      res.status(status).json(data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`BFF app is listening at http://localhost:${PORT}`);
});
