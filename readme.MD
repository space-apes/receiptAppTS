# Introduction

# features 

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
    - String: JWT_SECRET
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
