import SqlUserDataService from "../sqlUserDataService";

describe('sqlUserDataService: ', ()=>{
    
    describe('areValidCredentials(): ', ()=>{
        describe('if given email address of non-existent user ', ()=>{
            it('should return false', async ()=>{

                const sqlUserDataService = await new SqlUserDataService({
                        host: process.env.TEST_DB_URL as string,
                        user: process.env.TEST_DB_USER as string,
                        password: process.env.TEST_DB_PASSWORD as string, 
                        database: process.env.TEST_DB_DATABASE as string,
                        connectionLimit: parseInt(process.env.TEST_DB_CONNECTIONLIMIT as string) as number
                });

                const valid: boolean = await sqlUserDataService.areValidCredentials({
                    userIdentifier: 'noExistingEmail@test.com',
                    password: 'password'
                });
                await sqlUserDataService.close();

                expect (valid).toBe(false);
            });
        });

        describe('if given valid email address but invalid password', ()=>{
            it('should return false', async ()=>{

                const sqlUserDataService = await new SqlUserDataService({
                        host: process.env.TEST_DB_URL as string,
                        user: process.env.TEST_DB_USER as string,
                        password: process.env.TEST_DB_PASSWORD as string, 
                        database: process.env.TEST_DB_DATABASE as string,
                        connectionLimit: parseInt(process.env.TEST_DB_CONNECTIONLIMIT as string) as number
                });

                const valid: boolean = await sqlUserDataService.areValidCredentials({
                    userIdentifier: 'testUser1@test.com',
                    password: 'password'
                });
                await sqlUserDataService.close();

                expect (valid).toBe(false);
            });
        });

        describe('if given valid email address and valid password', ()=>{
            it('should return true', async ()=>{

                const sqlUserDataService = await new SqlUserDataService({
                        host: process.env.TEST_DB_URL as string,
                        user: process.env.TEST_DB_USER as string,
                        password: process.env.TEST_DB_PASSWORD as string, 
                        database: process.env.TEST_DB_DATABASE as string,
                        connectionLimit: parseInt(process.env.TEST_DB_CONNECTIONLIMIT as string) as number
                });

                const valid: boolean = await sqlUserDataService.areValidCredentials({
                    userIdentifier: 'testUser1@test.com',
                    password: 'testuser1password'
                });
                await sqlUserDataService.close();

                expect (valid).toBe(true);
            });
        });
    });
});
