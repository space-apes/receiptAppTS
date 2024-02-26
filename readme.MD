# table of contents 
TODO

# Introduction
this is my dream BE project with the goal to minimize software maintenance costs and developer headaches.  

single-language stack: typescript react FE and typescript express BE. less context switching when doing full-stack work. FE and BE teams can communicate more clearly and understand each other's needs.  

contract driven API development: single source of truth using openAPI 3.0 specification, generate as much code by trusted open source libraries as possible over writing my own solutions. language/framework agnostic and can switch technologies if needed. 

test-driven: increase coverage, eliminate bias of writing tests to fit code that has already been written. 

12 factor app: adheres to as much as possible.... TODO

3 layer architecture: controller/API layer, data store service layer, business logic layer. each can be swapped with minimal effect on other layers. each layer can be tested independently and together. 


experiment with sockets and asynchronous communication 
experiment with enterprise level work flow
experiment with avoiding ORM


# stack 

# features 
- experimented with git projects workflow for ticketing / work delegation, task breakdown, version control, tracking
  - https://github.com/users/space-apes/projects/7/
- contract-driven api development using openAPI 3
  - spec for each endpoint written first in comments above controller defsnition 
  - specs for endpoints parsed by swagger-jsdoc and used to generate expressBE/openApiSpec.json
  - the json is used to generate validation middleware using express-openapi-validator
  - the json also used to generate API documentation using express-ui
  - the next API i build i would like to start completely from opanAPI spec and generate everything else 
- custom Errors, APIError handling flow, synchronous and asynchronous error handling flow 
- 
- test driven 
  - TODO 
- asynchronous communication through sockets 
  - the whole process of users identifying which charges belong to them happens in real time 
  - TODO
- authentication and authorization and user session as stateless as possible using JWTs
  - TODO
- non-MVC
  - i love MVC pattern but i wanted to exercise...
  - TODO

# future improvements: 
- be completely contract driven instead of partially and generate all controller, validator, model code from contract
- pull User, Transaction, Session, and ReceiptParsing services into their own micro-service instances with Dockerfiles and node images. reverse-proxy for monitoring, load-balancers for each service with horizontal scaling
- further separate service layer into generic data retrieval layers and programatic business logic/processing layer. the data retrieval layer could handle retrieving and formatting data in some standardized way and the business logic layer could remain unchanged. 


# how to run the app
1. clone entire repo
2. install dependencies by running 'npm install' in both 
3. install mySQL server locally, note credentials, URL, db   
4. Create dev database on mysql server
	- log-in to mysql server via mysql client (DBeaver)
	- MySQL Script:
	```
	CREATE DATABASE receiptAppDev
	```
3. create .env files 
  - BE: needs fields:
    - String: ENVIRONMENT (set to 'prod' or 'dev' for now) this will set CORS hosts
    - Number: EXPRESS_PORT
    - String: EXPRESS_BASE_URL #ex: https://127.0.0.1
    - string: EXPRESS_URL_PATH_PREFIX #ex: /api
    - String[]: ALLOWED_HOSTS
    - String: JWT_SECRET # arbitrary random string
    - String: DB_DATABASE
    - String: DB_URL
    - String: DB_USER
    - String: DB_PASSWORD 

  - FE needs fields: 
    - String: BE_URL
    - ...

4. run BE population script
  - npx ts-node populateDB.ts

5. start up BE server 
  - cd expressReceiptBE 
  - npm start 
6. start up FE server 
  - cd react-receipt-fe
  - npm start 
7. should see the socket.io console.log messages for 'user connected' and updateItemUser
