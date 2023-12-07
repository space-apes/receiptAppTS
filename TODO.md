## Immediate Tasks
- Get Authentication w/ JWT working
- Build pages and flow
- Integrate from Flowchart

---

### Jen Practice WebApp Tasks
- Add an Endpoint (BE) 
	- Transactions Endpoint
	- transactions/ ___
	- Supply User ID
	- Response: All transactions that the users is a part of 
		- Data such as Initiator user, Business name, date, all items from transaction 
- Add a Component or Page (FE)
	- Based on user, calculate own total from transaction (based on user id)  
- Prioritize what we gotta do (Move tasks to Git Projects)

---

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
  - set it by environment variable 'local' / 'dev' / 'prod' etc 
- make sure to remove all that global context stuff or decide to keep it
- decide on adding the socket listeners within specific components
  - app wide is extra traffic for the server and clients listening when they dont need to 
- add openAPI for all endpoints
- add linter to commit script / learn to use linter with IDE
- have BE running in HTTPS
- write auth middleware but REPLACE WITH PASSPORT, then maybe aws cognify
- make rooms expire 
- ensure logic is pulled out of controller functions into library files/functions
  - controller should only do the following: 
    - validate any submitted data 
    - call authorization function
    - retrieve data from db
    - call business logic function
    - respond 
- do authorization on rooms for limited number of users (set by initiator) 
  - join() request with credentials 

- maake rooms scalable. when x number of simultaneous users, scale horizontally
- receipt limit! 
  - number of items 
- tests 
  - endpoint tests 
  - unit tests
  - security tests
- consider storing money as a diff datatype in db 


# REGISTRATION FLOW: NEED TO FIGURE OUT HOW ROOMKEY IS PERSISTED should be in JWT somehow

click 'register' 
POST email and password to /register endpoint
generate hash from password 
create user with hashed password and store in DB 
create JWT and send back to client 
store JWT in HTTP-only cookie 
client makes request to resource (EX: createTransaction, getTransaction) to API with JWT in http header 
middleware either grants access and makes changes or redirects user back to sign in screen 
