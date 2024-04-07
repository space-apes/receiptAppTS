import { Request, Response, NextFunction } from 'express';
import SessionService from '../services/sessionService/sessionService';
import { getSessionService, getUserDataService } from '../serviceSelector';
import { getRandomString } from '../library/socketUtils';
import UserDataService  from '../services/userDataService/userDataService';
import {sign, verify} from 'jsonwebtoken';
import { 
    APIBadRequestError,
    APIForbiddenError,
    APINotFoundError,
    APIUnauthorizedError
 } from '../errors/apiError';
import argon2 from 'argon2'; 
import { getUser } from './usersController';
import { UserDataServiceError } from '../services/userDataService/userDataServiceError';
import { userInfo } from 'os';

//TODO: OPENAPI SCHTUFF

/*
const createNewRegisteredSession = async (req: Request, res: Response, next: NextFunction) => {

    //note: use dedicated auth/identity services for next iteration

    const email = req.body.userIdentifier || '';
    const password = req.body.password || '';
    const displayedName = req.body.displayedName || '';
    const roomName = req.body.roomName || ''; 

    try {

        //if only supply one of email or password, throw error
        if (( !email && password) || (email && !password)){
            throw new APIBadRequestError({
                path: req.originalUrl,
                logging: true,
                context: {
                    email: email,
                    password: password
                } 
            }, "supplying only 1 of email and password "); 
        }

        let token: string = '';

        //guest case: userId is -1 and displayedName taken from payload
        if (!email){

            token = sign (
                {
                    userId: -1,
                    displayedName: displayedName,
                    roomName: `${roomName}-${getRandomString()}`
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: process.env.JWT_DURATION
                }
            );
        }
        //registered case: update userId and displayedName
        else {

            const userDataService: UserDataService = await getUserDataService();
            //if password is not valid, throw forbidden error
            if (! userDataService.passwordIsValid(email, password)){
                throw new APIForbiddenError({
                    path: req.originalUrl,
                    logging: true,
                    context: {
                        email: email,
                        password: password
                    } 
                }); 
            }
            
                //will throw UserDataServiceNotFoundError if no existing user
            const existingUser = await userDataService.getByUserEmail(email); 

            userDataService.close && userDataService.close(); 

            const registeredUserDisplayedName: string =  `${existingUser.firstName} ${existingUser.lastName.substring(0,1)}.`; 

            token = sign(
                {
                    userId: existingUser.userId,
                    displayedName: registeredUserDisplayedName,
                    roomName: `${roomName}-${getRandomString()}`
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: process.env.JWT_DURATION
                }
            );
        }

        //create httpOnly cookie to store jwt 
        res.cookie("receiptAppJWT", token, {
        maxAge:60000 * 60,
        httpOnly:true,
        //secure:true
        });

        //give success response
        return res.status(200).json({
            message: "successfully created access token", 
        });

        
    }catch(err){
        next(err);
    }
}
*/


/**
 * @openapi
 * /api/sessions/createGuestSession:
 *   post:
 *     summary: creates new JWT session token for guest initiator user
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayedName
 *               - roomName
 *             properties:
 *               displayedName: 
 *                 type: string
 *               roomName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: >
 *           successfully created session token for guest user
 *           token 'receiptAppJWT' will be set.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: receiptAppJWT=21312412414; httpOnly
 *         content:
 *           application/json: 
 *             schema:
 *               type: object 
 *               required: 
 *                 - msg
 *               properties:
 *                 msg: 
 *                   type: string
 *       '400': 
 *         description: catch-all invalid input response
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *                 - msg
 *               properties:
 *                 path:
 *                   type: string
 *                 msg:
 *                   type: string  
 *  
 */

const createGuestSession = async (req: Request, res: Response, next: NextFunction) => {

    //note: use dedicated auth/identity services for next iteration

    const {displayedName, roomName} = req.body;


    try {

        if (roomName.includes("-")){
            throw new APIBadRequestError({
                path: req.originalUrl,
                logging: true,
                context: {
                    roomName: roomName
                }
            }, "roomName can not contain '-' characters");
        }

        const sessionService: SessionService = await getSessionService();

        const sessionToken: string = sessionService.create({
            displayedName: displayedName,
            roomName: sessionService.addRandomStringToRoomName(roomName)
        });

        const jwtDurationInSeconds = sessionService.convertJWTDurationToSeconds(process.env.JWT_DURATION as string);

        //create httpOnly cookie to store jwt 
        res.cookie("receiptAppJWT", sessionToken, {
        maxAge: jwtDurationInSeconds,
        httpOnly:false,
        //secure:true
        });

        //give success response
        return res.status(200).json({
            msg: "successfully created access token", 
        });

        
    }catch(err){
        next(err);
    }
}

/**
 * @openapi
 * /api/sessions/createRegisteredSession:
 *   post:
 *     summary: creates new JWT session token for registered initiator user
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayedName
 *               - roomName
 *               - email
 *               - password
 *             properties:
 *               displayedName: 
 *                 type: string
 *               roomName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: >
 *           successfully created session token for registered user
 *           token 'receiptAppJWT' will be set.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: receiptAppJWT=21312412414; httpOnly
 *         content:
 *           application/json: 
 *             schema:
 *               type: object 
 *               required: 
 *                 - msg
 *               properties:
 *                 msg: 
 *                   type: string
 *       '401': 
 *         description: invalid credentials
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *                 - msg
 *               properties:
 *                 path:
 *                   type: string
 *                 msg:
 *                   type: string  
 *       '400': 
 *         description: catch-all invalid input response
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *                 - msg
 *               properties:
 *                 path:
 *                   type: string
 *                 msg:
 *                   type: string  
 *  
 */

const createRegisteredSession = async (req: Request, res: Response, next: NextFunction) => {

    //note: use dedicated auth/identity services for next iteration

    const {displayedName, roomName, email, password} = req.body; 

    try {
        
        if (roomName.includes("-")){
            throw new APIBadRequestError({
                path: req.originalUrl,
                logging: true,
                context: {
                    roomName: roomName
                }
            }, "roomName can not contain '-' characters");
        }

        //if no user exists with those credentials, respond 401
        //i don't like having the UserDataService be contacted to verify 
        // email and password. in future will use service rolling identity and tokens in 1 
        const userDataService: UserDataService = await getUserDataService();

        const validCredentials: boolean = await userDataService.areValidCredentials({
            userIdentifier:email,
            password:password
        });

        if (!validCredentials){

            userDataService.close && userDataService.close();
            throw new APIUnauthorizedError({
                path: req.originalUrl,
                logging: true,
                context: {
                    email: email,
                    password: password 
                }
            });
        }

        //valid credentials so now retrieve userId 
        //again, this will not be 2 separate queries in next iterateion.

        const userId: number = (await userDataService.getByUserEmail(email)).userId;
        userDataService.close && userDataService.close()

        const sessionService: SessionService = await getSessionService();

        const sessionToken: string = sessionService.create({
            userId: userId,
            displayedName: displayedName,
            roomName: sessionService.addRandomStringToRoomName(roomName)
        });

        const jwtDurationInSeconds = sessionService.convertJWTDurationToSeconds(process.env.JWT_DURATION as string);

        //create httpOnly cookie to store jwt 
        res.cookie("receiptAppJWT", sessionToken, {
        maxAge: jwtDurationInSeconds,
        httpOnly:true,
        //secure:true
        });

        //give success response
        return res.status(200).json({
            msg: "successfully created access token", 
        });
        
    }catch(err){
        next(err);
    }
}


export {createGuestSession, createRegisteredSession};

