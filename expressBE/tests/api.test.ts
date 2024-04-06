import supertest from 'supertest';
import app from './app';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import JWTClaims from '../services/sessionService/jwtClaims';

let testUserData = {
    valid: {
        email: "jestUser1@test.com",
        firstName: "jestUser1",
        lastName: "jestUser1",
        password: "124tk1hj41"
    },
    missingField: {
        email: "jestUser2@test.com",
        firstName: "jestUser2",
        lastName: "jestUser1",
    },
    invalidField: {
        email: "jestUser3@test.com",
        firstName: "jestUser3",
        lastName: "jestUser3",
        password: "sadsad",
        chickenCount: 2
    }
}

let testTransactionData = {
    valid1: {
        initiatorUserId: 6,
        businessName: "rolf's chuckle hut",
        receiptItems: [
            {
                userId: -1,
                username: "lisaT",
                itemName: "margarita",
                itemPrice: 6.67
            },
            {
                userId: 4,
                username: "forgotDaName",
                itemName: "honeydip",
                itemPrice: 2.00
            },
        ]
    },
    missingCoreField: {
        businessName: "down the hatch!",
        receiptItems: [
            {
                userId: -1,
                username: "lisaT",
                itemName: "margarita",
                itemPrice: 6.67
            },
            {
                userId: 6,
                username: "keanuR",
                itemName: "honeydip",
                itemPrice: 2.00
            },
        ]

    },
    missingReceiptItemField: {
        initiatorUserId: 6,
        businessName: "gustatory delights",
        receiptItems: [
            {
                username: "lisaT",
                itemName: "margarita",
                itemPrice: 6.67
            },
            {
                userId: 6,
                username: "keanuR",
                itemName: "honeydip",
                itemPrice: 2.00
            },
        ]

    },
    itemPriceIsNonNumeric: {
        initiatorUserId: 1,
        businessName: "tickly's bun cabin",
        receiptItems: [
            {
                userId: -1,
                username: "johnnyMac",
                itemName: "bourbon",
                itemPrice: 10.53
            },
            {
                userId:6,
                username: "keanuR",
                itemName: "simpleGreenCoctail",
                itemPrice: "supposedToBeNumeric"
            },
        ]

    },
    intiatorUserIdDoesNotExist: {
        initiatorUserId: 50,
        businessName: "rolf's chuckle hut",
        receiptItems: [
            {
                userId: -1,
                username: "frankieR",
                itemName: "HotCrossBuns",
                itemPrice: 42.42
            },
            {
                userId: 6,
                username: "keanuR",
                itemName: "shredded wheat",
                itemPrice: 3.15
            },
        ]

    },
    receiptItemsUserDoesNotExist: {
        initiatorUserId: 6,
        businessName: "corner store",
        receiptItems: [
            {
                userId: -1,
                username: "lisaT",
                itemName: "milkduds",
                itemPrice: 3.00
            },
            {
                userId:50,
                username: "brokenUser",
                itemName: "hotdog",
                itemPrice: 2.15
            },
        ]

    },
    requesterIsNotInitiatorUserId: {}
};

describe("Users controller", ()=>{

    //GET USER
    describe("GET user", () =>{

        describe("url does not refer to existing user", () =>{
            it("should respond with 404 http status code", async () =>{

                const res = await supertest(app)
                .get("/api/users/50")
                .set("content-type", "application/json");

                expect(res.status).toBe(404);

            });
        });

        describe("given user does exist", () =>{
            it("should respond with 200 http status code and contain 'userId' field", async () =>{

                const res = await supertest(app)
                    .get("/api/users/1")
                    .set("content-type", "application/json");

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('userId');

            });
        });
    });

    //POST USER
    describe("POST user", () =>{
        describe("given valid request", () =>{
            it("should respond with 201 http status code and contain 'userId' field ", async () =>{

                const res = await supertest(app)
                    .post("/api/users/")
                    .set("content-type", "application/json")
                    .send(testUserData['valid']);

                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('userId');
            });
        });

        describe("given user with same email address", () =>{
            it("should respond with 409 http status code", async () =>{

                const res = await supertest(app)
                    .post("/api/users/")
                    .set("content-type", "application/json")
                    .send(testUserData['valid']);

                expect(res.status).toBe(409);
            });
        });

        describe("given request missing a field", () =>{

            it("should respond with 400 http status code", async () =>{
                const res = await supertest(app)
                    .post("/api/users/")
                    .set("content-type", "application/json")
                    .send(testUserData['missingField']);

                expect(res.status).toBe(400);
            });
        });

        describe("given request with invalid field", () =>{

            it("should respond with 400 http status code", async () =>{
                const res = await supertest(app)
                    .post("/api/users/")
                    .set("content-type", "application/json")
                    .send(testUserData['invalidField']);

                expect(res.status).toBe(400);
            });
        });
    });

    //PUT USER
    describe("PUT user", () =>{

        describe("given valid request with 1 field", () =>{
            it("should respond with 200 http status code and all fields", async () =>{

                const res = await supertest(app)
                    .put("/api/users/6")
                    .set("content-type", "application/json")
                    .send({firstName: "jimbo"});

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('userId');
                expect(res.body).toHaveProperty('firstName');
                expect(res.body).toHaveProperty('lastName');
                expect(res.body).toHaveProperty('email');
                expect(res.body.firstName).toBe('jimbo')
            });
        });

        describe("given valid request with 2 fields", () =>{
            it("should respond with 200 http status code and all fields", async () =>{

                const res = await supertest(app)
                    .put("/api/users/6")
                    .set("content-type", "application/json")
                    .send({firstName: "keanu", lastName: "reeves"});

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('userId');
                expect(res.body).toHaveProperty('firstName');
                expect(res.body).toHaveProperty('lastName');
                expect(res.body).toHaveProperty('email');
                expect(res.body.firstName).toBe('keanu')
                expect(res.body.lastName).toBe('reeves')
            });
        });

        //update email with existing email address 

        describe("given request with invalid fields", () =>{
            it("should respond with 400 http status code", async () =>{

                const res = await supertest(app)
                    .put("/api/users/6")
                    .set("content-type", "application/json")
                    .send({favoriteAuthor: 'dostoyevsky'});

                expect(res.status).toBe(400);
            });
        });

        describe("given request with no request body", () =>{
            it("should respond with 400 http status code", async () =>{

                const res = await supertest(app)
                    .put("/api/users/6")
                    .set("content-type", "application/json")

                expect(res.status).toBe(400);
            });
        });

        describe("given request with userId that does not exist", () =>{
            it("should respond with 404 http status code", async () =>{

                const res = await supertest(app)
                    .put("/api/users/50")
                    .set("content-type", "application/json")
                    .send({favoriteAuthor: 'dostoyevsky'});

                expect(res.status).toBe(400);
            });
        });
    });

    //for now, not DELETE tests since I think I will remove this feature 
    //to preserve transaction integrity 

});


describe("transactions controller", ()=> {

    describe("POST transaction", () => {

        describe("given valid request", ()=>{
            it("should respond with 201 and transactionId", async () => {
                const res = await supertest(app)
                    .post("/api/transactions")
                    .set("content-type", "application/json")
                    .send(testTransactionData['valid1']);

                    expect(res.status).toBe(201);
                    expect(res.body).toHaveProperty('transactionId');
            });
        });

        describe("given non-existing non-guest initiatorUserId", ()=>{
            it("should respond with 404", async () => {
                const res = await supertest(app)
                    .post("/api/transactions")
                    .set("content-type", "application/json")
                    .send(testTransactionData['intiatorUserIdDoesNotExist']);
                
                    expect(res.status).toBe(404);
            });
        }); 

        describe("given missing a core field (initiatorUserId)", ()=>{
            it("should respond with 400", async () => {
                const res = await supertest(app)
                    .post("/api/transactions")
                    .set("content-type", "application/json")
                    .send(testTransactionData.missingCoreField);
                
                    expect(res.status).toBe(400);
            });
        }); 

        describe("given missing a receiptItem field (userId)", ()=>{
            it("should respond with 400", async () => {
                const res = await supertest(app)
                    .post("/api/transactions")
                    .set("content-type", "application/json")
                    .send(testTransactionData.missingReceiptItemField);
                
                    expect(res.status).toBe(400);
            });
        });

        describe("given non numeric receiptItem.itemPrice", ()=>{
            it("should respond with 400", async () => {
                const res = await supertest(app)
                    .post("/api/transactions")
                    .set("content-type", "application/json")
                    .send(testTransactionData.itemPriceIsNonNumeric);
                
                    expect(res.status).toBe(400);
            });
        });
    });

    describe("GET transaction by transactionId", ()=>{

        describe("given valid request", ()=>{
            it("should respond 200 and contain all fields", async () =>{
                const res = await supertest(app)
                    .get("/api/transactions/3")
                    .set("content-type", "application/json");
                
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveProperty('transactionId');
                    expect(res.body).toHaveProperty('businessName');
                    expect(res.body).toHaveProperty('receiptItems');
                    expect(res.body.receiptItems[0]).toHaveProperty('userId');
                    expect(res.body.receiptItems[0]).toHaveProperty('username');
                    expect(res.body.receiptItems[0]).toHaveProperty('itemName');
                    expect(res.body.receiptItems[0]).toHaveProperty('itemPrice');
            });
        });

        describe("given transactionId that does not refer to existing transaction", ()=>{
            it("should respond 404", async () =>{
                const res = await supertest(app)
                    .get("/api/transactions/50")
                    .set("content-type", "application/json");
                
                    expect(res.status).toBe(404);
            });
        });
    });  

    
    describe("GET transactionsByUserId", ()=>{
        describe("given valid userId that corresponds no existing transactions", ()=>{
             it("should respond 404", async()=>{
                const res = await supertest(app)
                    .get("/api/transactions/user/5")
                    .set("content-type", "application/json");
                
                    expect(res.status).toBe(404);
             });
        });
    });


    
    describe("GET transactionsByUserId", ()=>{
        describe("given valid userId that corresponds with transaction that user was initiator of", ()=>{
             it("should respond 200 and with single transaction, and all fields", async()=>{
                const res = await supertest(app)
                    .get("/api/transactions/user/1")
                    .set("content-type", "application/json");
                
                    expect(res.status).toBe(200);
                    expect(res.body[0]).toHaveProperty('initiatorUserId');
                    expect(res.body[0]).toHaveProperty('businessName');
                    expect(res.body[0]).toHaveProperty('dateCreated');
                    expect(res.body[0]).toHaveProperty('receiptItems');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('itemName');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('itemPrice');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('username');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('userId');

             });
             
        });
    });

    
    describe("GET transactionsByUserId", ()=>{
        describe("given valid userId that corresponds with transaction that user was initiator of", ()=>{
             it("should respond 200 and with multiple transactions, and all fields", async()=>{
                const res = await supertest(app)
                    .get("/api/transactions/user/4")
                    .set("content-type", "application/json");
                
                    expect(res.status).toBe(200);
                    expect(res.body.length).toBeGreaterThan(1);
                    expect(res.body[0]).toHaveProperty('initiatorUserId');
                    expect(res.body[0]).toHaveProperty('businessName');
                    expect(res.body[0]).toHaveProperty('dateCreated');
                    expect(res.body[0]).toHaveProperty('receiptItems');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('itemName');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('itemPrice');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('username');
                    expect(res.body[0].receiptItems[0]).toHaveProperty('userId');

             });
             
        });
    });
});


describe("Sessions controller", ()=>{

    describe("POST /createGuestSession", () =>{

        describe("if given valid roomName and displayedName", () =>{
            it("should respond with 200 and set cookie with userId -1", async () =>{

                const res = await supertest.agent(app)
                .post("/api/sessions/createGuestSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'testJWTSuccessName',
                    'roomName': 'testJWTSuccessRoomName'
                });

                const setCookies = res.headers['set-cookie'];

                //set only one cookie
                expect (setCookies.length).toBe(1);
                const cookieString = setCookies[0];

                //cookie includes name of jwt
                expect(cookieString.includes('receiptAppJWT'));

                //parse out just the jwt from the cookie string
                const jwt = cookieString.match(/receiptAppJWT=([^;]+);/)?.[1];
                
                expect(res.status).toBe(200);


                const claims = jwtDecode<JwtPayload & JWTClaims>(jwt || '');
                
                //have correct fields
                expect(claims).toHaveProperty('userId');
                expect(claims).toHaveProperty('displayedName');
                expect(claims).toHaveProperty('roomName');
                expect(claims).toHaveProperty('exp');

                //have guest userId
                expect(claims.userId).toBe(-1);


            });
        });

        describe("if missing any required fields", ()=>{
            it("should respond with 400", async ()=>{
                const res = await supertest(app)
                .post("/api/sessions/createGuestSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'testJWTSuccessName',
                });
                
                expect(res.status).toBe(400);
            })
        });

        describe("if roomName contains '-'", ()=>{
            it("should respond with 400", async ()=>{
                const res = await supertest(app)
                .post("/api/sessions/createGuestSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'testJWTSuccessName',
                    'roomName': 'cool-room'
                });
                
                expect(res.status).toBe(400);
            })
        })
    });

    describe("POST /createRegisteredSession", () =>{
        describe('if given valid credentials and all required fields', ()=>{
            it("should respond with 200 and set cookie non guest userId", async () =>{

                const res = await supertest.agent(app)
                .post("/api/sessions/createRegisteredSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'coolTestUser',
                    'roomName': 'testJWTSuccessRoomName',
                    'email': 'testUser1@test.com',
                    'password':'testuser1password'
                });

                const setCookies = res.headers['set-cookie'];

                //set only one cookie
                expect (setCookies.length).toBe(1);
                const cookieString = setCookies[0];

                //cookie includes name of jwt
                expect(cookieString.includes('receiptAppJWT'));

                //parse out just the jwt from the cookie string
                const jwt = cookieString.match(/receiptAppJWT=([^;]+);/)?.[1];
                
                expect(res.status).toBe(200);

                const claims = jwtDecode<JwtPayload & JWTClaims>(jwt || '');
                
                //have correct fields
                expect(claims).toHaveProperty('userId');
                expect(claims).toHaveProperty('displayedName');
                expect(claims).toHaveProperty('roomName');
                expect(claims).toHaveProperty('exp');

                expect(claims.userId != -1);


            });
        });

        describe('all required fields but nonexistent email', ()=>{
            it("should respond with 401", async () =>{

                const res = await supertest(app)
                .post("/api/sessions/createRegisteredSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'coolTestUser',
                    'roomName': 'testJWTSuccessRoomName',
                    'email': 'nonExistantUser@test.com',
                    'password':'testuser1password'
                });

                expect(res.status).toBe(401);
            });
        });

        describe('all required fields but nonexistent email', ()=>{
            it("should respond with 401", async () =>{

                const res = await supertest(app)
                .post("/api/sessions/createRegisteredSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'coolTestUser',
                    'roomName': 'testJWTSuccessRoomName',
                    'email': 'testUser1@test.com',
                    'password':'invalidPassword'
                });

                expect(res.status).toBe(401);
            });
        });

        describe('room name with hyphen', ()=>{
            it("should respond with 400", async () =>{

                const res = await supertest(app)
                .post("/api/sessions/createRegisteredSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'coolTestUser',
                    'roomName': 'testJWTFailure-RoomName',
                    'email': 'testUser1@test.com',
                    'password':'testuser1password'
                });

                expect(res.status).toBe(400);
            });
        });

        describe('missing a field', ()=>{
            it("should respond with 400", async () =>{

                const res = await supertest(app)
                .post("/api/sessions/createRegisteredSession")
                .set("content-type", "application/json")
                .send({
                    'displayedName': 'coolTestUser',
                    'email': 'testUser1@test.com',
                    'password':'testuser1password'
                });

                expect(res.status).toBe(400);
            });
        });
    });
});