# Shop Backend

## Prerequisites
- Link to a frontend repository: https://github.com/AliaksandrVarachai/shop-react-redux-cloudfront/pull/2/files
- Link to a hosted web-site: https://d1fxaqepkkpfnn.cloudfront.net

## Task 3

### Task 3.1
Lambda `getProductList` is implemented and integrated with frontend. 
Direct link: https://rf0c5q2bb7.execute-api.eu-west-1.amazonaws.com/dev/products

### Task 3.2
Lambda `getProductsById` is implemented and integrated with frontend.
Direct link: https://rf0c5q2bb7.execute-api.eu-west-1.amazonaws.com/dev/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa

### Task 3.3
PR is created

### Additional tasks
1. Async/await is used
2. ES6 modules are used
3. Webpack is configured
4. SWAGGER documentation is created: https://app.swaggerhub.com/apis/AliaksandrVarachai/product-service/1.0.0
5. Lambda handlers are covered by basic Unit tests
6. Lambda handlers `getProductsList`, `getProductsById` code are separated in codebase
7. Error scenarious are handled (404 error if a product is not found by ID)

## Task 4

- Link to a frontend repository: https://github.com/AliaksandrVarachai/shop-react-redux-cloudfront
- Link to a hosted web-site: https://d1fxaqepkkpfnn.cloudfront.net

### Task 4.1
Created AWS RDS instance (PostgreSQL), initialized, and seeded with SQL scripts:
- `db-init.sql`
- `seeds.sql`

### Task 4.2
Lambdas are integrated with the created database:
  - `GET /products` https://rf0c5q2bb7.execute-api.eu-west-1.amazonaws.com/dev/products
  - `GET /products/{id}` https://rf0c5q2bb7.execute-api.eu-west-1.amazonaws.com/dev/products/c10944ac-acba-4db4-af4a-5c7240a94518

Environmental variables are stored locally in `.env` file.

### Task 4.3
Lambda `POST /products` is implemented and deployed.
See Swagger docs: https://app.swaggerhub.com/apis/AliaksandrVarachai/product-service/1.0.0

### Additional tasks
1. `POST /products` returns `400` error if product data is invalid
2. All lambdas return `500` error for unhandled errors in code
3. All calls of lambdas do `console.log` for all incoming request with their arugments
4. Creation of a product is transaction based

## Task 5

- Link to the integrated frontend repository: https://github.com/AliaksandrVarachai/shop-react-redux-cloudfront/pull/3/files
- Link to a hosted web-site: https://d1fxaqepkkpfnn.cloudfront.net

### Task 5.1
- `import-service` with `importProductsFile` lambda is implemented. Example of getting a signed URL for an uploaded file:
  https://6t8amjybxg.execute-api.eu-west-1.amazonaws.com/dev/import?name=file.csv

### Task 5.2
- `importFileParser` lambda triggered by `s3:ObjectCreated` event is implemented. It parses data in a stream via `csv-parser`
  and logs each record in `CloudWatch`

### Task 5.3
- Created PRs both for backend implementation and FE integration.

### Additional tasks
1. `async/await` is used in lambda functions
2. `importProductsFile` lambda is covered by unit tests
3. At the end of the parsing stream the lambda function moves loaded CSV file to '/parsed' folder
