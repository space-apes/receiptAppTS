import supertest from 'supertest';
import app from '../app';

describe("Users controller", ()=>{
    describe("retrieve a user", () =>{
        it("should respond with 200 http status code", async () =>{
            const response = await supertest(app)
                .get("/api/users/1")
                .set("content-type", "application/json");

                console.log(response.error);
            
            expect(response.status).toBe(200);
        });

    });
});