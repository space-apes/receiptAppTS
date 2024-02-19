# Introduction

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
