# Shop Backend

## Prerequisites
- Link to a frontend repository: https://github.com/AliaksandrVarachai/shop-react-redux-cloudfront/pull/2/files
- Link to a hosted web-site: https://d1fxaqepkkpfnn.cloudfront.net

## Task 3

### Task 3.1
Lambda `getProductList` is implemented and integrated with frontend. 
Direct link: https://rf0c5q2bb7.execute-api.eu-west-1.amazonaws.com/dev/products/list

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
