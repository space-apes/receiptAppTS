#how to run the receipt app


# items to discuss today: 
- GETTING LOCAL ENVIRONMENT UP 
- fe and be 
- env files for both fe and be 
- authentication plan: for now do self, in future use cognify
- user plan: 
  - all guests will be users too and will be persisted in db. i forget why but there was a compelling reason. 
- jwt plan: 
  - jwt stored in http-only cookie on login or 'continue as guest' 
  - userId:to narrow down which resources user can interact with
  - room-name: in case user closes browser by accident, so that socket.io broadcasts messages to the right clients 
- transitioning between pages 
- DB plan; creating/updating ERD
  - note.io stored within repo 
- what is next step for both of us: create git project and high level sagas, break sagas down into tickets and assig 

# how to run the app
1. clone entire repo
2. install dependencies by running 'npm install' in both 
3. install mySQL server locally, note credentials, URL, db   
3. create .env files 
  - BE: needs fields:
    - String: ENVIRONMENT (set to 'prod' or 'dev' for now) this will set CORS hosts
    - Number: EXPRESS_PORT
    - String[]: PROD_ALLOWED_HOSTS
    - String: JWT_SECRET
    - String: DB_URL
    - String: DB_PASSWORD 

  - FE needs fields: 
    - String: BE_URL
    - ...

4. run BE population script
  - create tables
  - populate with test users and transactions 

5. start up BE server 
  - cd expressReceiptBE 
  - npm start 
6. start up FE server 
  - cd react-receipt-fe
  - npm start 
7. should see the socket.io console.log messages for 'user connected' and updateItemUser
