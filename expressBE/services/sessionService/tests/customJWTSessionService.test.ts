import CustomJWTSesssionService from "../customJWTSessionService";
import {sign, JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';

//import dotenv from 'dotenv';
//dotenv.config({path: '../../../.env'});

describe('CustomJWTSessionService: ', ()=>{
    
    describe('isValidSessionToken(): ', ()=>{

        describe('when given valid token', ()=>{
            it('should return true ', async ()=>{
                const token = sign({key: 'coolValue'}, process.env.JWT_SECRET as string);
                const customJWTSessionService: CustomJWTSesssionService = new CustomJWTSesssionService();

                const isValidToken: boolean = await customJWTSessionService.isValidSessionToken({jwt: token});

                expect(isValidToken);
            });
        });

        
        describe('when token has been tampered with', ()=>{
            it('should throw JsonWebTokenError ',  async ()=>{

                const originalToken = sign({key: 'coolValue'}, process.env.JWT_SECRET as string);
                const customJWTSessionService: CustomJWTSesssionService = new CustomJWTSesssionService();

                //original token should be valid
                expect( await customJWTSessionService.isValidSessionToken({jwt: originalToken}));

                let splitString = originalToken.split('');
                 
                splitString[1] = '0';
                splitString[2] = '0';

                const modifiedToken = splitString.join('');

                
                expect(async ()=> { 
                    await customJWTSessionService.isValidSessionToken({jwt:modifiedToken});
                }).rejects.toThrow(JsonWebTokenError);
                
            });
        });

        describe('when token is expired', ()=>{
            it('should throw TokenExpiredError',  async ()=>{

                const expiredToken = await sign({key: 'coolValue'}, process.env.JWT_SECRET as string, {expiresIn: '-10s'});
                const customJWTSessionService: CustomJWTSesssionService = new CustomJWTSesssionService();
                
                expect(async ()=> { 
                    await customJWTSessionService.isValidSessionToken({jwt:expiredToken});
                }).rejects.toThrow(TokenExpiredError);
            
            });
        });
    });
});
