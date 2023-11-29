- validate username and password using argon2
- decide on JWT scheme
  - userId
  - roomId 
  - expires
- generate JWTs for logged in users 
- generate JWTs for guests 
- create a set of fake users and transactions to test next step 
- endpoint for logged in users to see old transactions
  - should not be able to access other transactions 
- make sure to update cors for safety on both FE and BE 
- make sure to remove all that global context stuff or decide to keep it
- decide on adding the socket listeners within specific components
  - app wide is extra traffic for the server and clients listening when they dont need to 
- add openAPI for all endpoints
- add linter to commit script / learn to use linter with IDE
- have BE running in HTTPS
- write auth middleware but REPLACE WITH PASSPORT, then maybe aws cognify
- make rooms expire 
- do authorization on rooms for limited number of users (set by initiator) 
  - join() request with credentials 

- maake rooms scalable. when x number of simultaneous users, scale horizontally
- receipt limit! 
  - number of items 


# REGISTRATION FLOW: NEED TO FIGURE OUT HOW ROOMKEY IS PERSISTED should be in JWT somehow

click 'register' 
POST email and password to /register endpoint
generate hash from password 
create user with hashed password and store in DB 
create JWT and send back to client 
store JWT in HTTP-only cookie 
client makes request to resource (EX: createTransaction, getTransaction) to API with JWT in http header 
middleware either grants access and makes changes or redirects user back to sign in screen 
