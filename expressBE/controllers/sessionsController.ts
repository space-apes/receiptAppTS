import { Request, Response, NextFunction } from 'express';
import SessionService from '../services/sessionService/sessionService';
import { getSessionService, getUserDataService } from '../serviceSelector';
import { getRandomString } from '../library/socketUtils';
import UserDataService  from '../services/userDataService/userDataService';
import {sign, verify} from 'jsonwebtoken';
import { 
    APIBadRequestError,
    APIForbiddenError,
    APINotFoundError
 } from '../errors/apiError';
import argon2 from 'argon2'; 

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
 *     summary: creates new JWT session token for guest as initiator user
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
 *         description: successful creation of User
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

    const displayedName = req.body.displayedName || '';
    const roomName = req.body.roomName || '';

    if (roomName.includes("-")){
        return res.status(400).json({
            msg:"roomName can not include '-' character" 
        })
    }

    try {

        const sessionService: SessionService = await getSessionService();

        const sessionToken: string = sessionService.create({
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
    

export {createGuestSession};

