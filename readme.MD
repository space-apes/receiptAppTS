# Table of Contents 
1. [Introduction](#Introduction)
2. [Features](#features) 
3. [Stack](#stack)
4. [Future Improvements](#Future-Improvements)
5. [How To Run](#how-to-run)

# Introduction
This is my dream full stack web applicationwith the goals of minimizing software maintenance costs, developer headaches, and experimenting with
new technologies, architectures, and project management tools. It is currently _STILL IN DEVELOPMENT_. 

ReceiptApp is a service for groups of people who need a quick and easy way to split the bill at places like restaurants or bars. Simply scan a receipt which will be parsed by an OCR, send a unique URL link to your friends, then collectively select who will pay for which items will in real time. Once the purchase has been submitted, registered users have the ability to review previous receipts. In the future, payments will also be handled automatically by 3rd party payment APIs (stripe, venmo, etc). 

# Features
- single-language stack 
  - typescript react FE and typescript express BE.
  - less context switching when doing full-stack work.
  - FE and BE teams can communicate more clearly and understand each other's needs.  

- layered design to prepare for micro-services architecture: 
  - controller/API layer and service layer 
  - service layer for anything outside of synchronous operation with different implementations for different technologies
  - each service conforms to an interface and can be swapped in without affecting other layers 
  - custom error/exception handling flow for each layer
  - can easily be converted to micro-service architecture

- contract-driven API development
  - single source of truth using openAPI 3.0 specification
  - generate as much code by trusted open source libraries as possible over writing my own solutions (documentation, validators, client-side API library)
  - language/framework agnostic and can switch technologies if needed

- test-driven development: 
  - increase coverage
  - eliminate bias of writing tests to fit code that has already been written
  - reduce refactoring effort

- followed 12 factor app guidelines as much as possible

- experiment with avoiding ORM for SQL based services
  - for new hires, the syntax of SQL is well-known instead of needing to relearn operations/syntax of particular ORM
  - debugging BE issues might be easier because the code is closer to actual queries instead of through another layer 
  - i would say this experiment was only a partial success:  i wished for an ORM many times!

- experiment with sockets and asynchronous communication

- experiment with using github's built-in project management tools 
  - github Projects for tickets, work delegation: [ReceiptAppTS Project Page](https://github.com/users/space-apes/projects/7)
  - github Wiki for documentation: [ReceiptAppTS Wiki Page](https://github.com/space-apes/receiptAppTS/wiki)
 
- experiment with JWTs 
  - 'session' data and auth data stored in JWTs
  - added security
    - http-only cookies that can not be read directly by code
	- quick expiration
	- validation of JWTs to check for data integrity
  - allow session to be sticky without needing make expensive service calls


# Stack 
- all node/typescript
- FE
  - UI: react.js written in typescript 
  - asynchronous realtime communication: socket.io
- BE 
  - API: express.js written in typescript for API
  - JWT: jsonwebtoken
  - password hashing: Argon2
  - API validation: express-openapi-validator
  - API documentation: swagger-ui-express
  - persisted data services: mysql accessed by node through mysql2 library

# Future Improvements
- the real goal is to use this monolithic app as practice for converting into a cloud based scalable micro-services app: pull User, Transaction, Session, and ReceiptParsing services into their own micro-service instances with Dockerfiles and node images. reverse-proxy for monitoring, load-balancers for each service with horizontal scaling handled. I aim to build everything using terraform IaC. 
- be completely contract driven instead of partially and generate all controller, validator, model code from contract
- further separate service layer into generic data retrieval layers and programatic business logic/processing layer. the data retrieval layer could handle retrieving and formatting data in some standardized way and the business logic layer could remain unchanged.
- integration with third party payment APIs 


# How To Run
1. clone entire repo
2. install dependencies by running 'npm install' in both FE and BE directories
3. install mySQL server locally, or have a mySQL server available. note credentials, URL, db. ensure mySQL server is running   
4. Create dev database on mysql server
	- log-in to mysql server via mysql client (EX: DBeaver)
	- MySQL Script:
	```
	CREATE DATABASE receiptAppDev;
  CREATE DATABASE receiptAppTest; 
	```
3. create .env files 
  - BE: within BE directory create a file named .env fields and values:
    - String: NODE_ENV # example 'NODE_ENV=dev'. can select from 'dev, test, prod'
    - String[] ALLOWED_HOSTS
    - Number EXPRESS_PORT: # whatever port you want express server to run on 
    - String JWT_SECRET # arbitrary random string
    - String JWT_DURATION # ex "20m" or "1h" 

    - String DB_DATABASE 
    - String DB_URL 
    - String DB_USER 
    - String DB_PASSWORD
    - Number DEV_DB_CONNECTIONLIMIT
    
    - String TEST_DB_URL
    - String TEST_DB_USER
    - String TEST_DB_PASSWORD
    - String TEST_DB_DATABASE
    - Number TEST_DB_CONNECTIONLIMIT
  
  
  - FE: within FE directory create file named .env with fields and values: 
    - String: REACT_APP_BE_URL
    - String: REACT_APP_SOCKET_URL

4. from BE directory, run BE population script
  - `npm run populateDB`
  - (you can also run `npm run clearDB` to reset DB to starting state)

5. navigate to BE directory 'expressBE' and start up local BE server
  - `npm start` 
6. navigate to FE directory and start up local FE server
  - `npm start` 
  - web browser will automatically open a tab to FE
7. should see the socket.io console.log messages for 'user connected' and updateItemUser
8. navigate browser to FE address or `{BE address}/api-docs` to see openAPI documentation
