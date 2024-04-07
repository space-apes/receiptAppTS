import SessionService from './sessionService';
import JWTClaims from './jwtClaims';
import {sign, verify} from 'jsonwebtoken'; 


class CustomJWTSessionService implements SessionService {

    /**
     * create: creates a new session
     * 
     * if no userId supplied this is guest session, set userId to -1
     * 
     */

    create(params: {
        userId: number, 
        displayedName: string, 
        roomName: string
        isInitiator: boolean
    }): string {

        const {userId, displayedName, roomName, isInitiator} = params; 

        const jwtClaims: JWTClaims = {
            userId : userId,
            displayedName : displayedName,
            roomName:roomName,
            isInitiator: isInitiator 
        }

        return sign(
            jwtClaims,
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_DURATION
            }
        );
    }


    /**
     * verifies session token. 
     * 
     * returns true if valid 
     * throws 
     * 
     * @param params 
     * @returns 
     */
    async isValidSessionToken(params: {jwt: string}): Promise<boolean>{
        const {jwt} = params;

        try {
            const payload = verify(jwt, process.env.JWT_SECRET as string);   
            return payload ? true : false; 
        }catch(err){
            throw err;
        }
    }
    
    /**
     * this adds random string to end of socket.io roomname
     * for a tiny bit more security and to allow 
     * multiple instances of same roomname without conflicts
     * 
     * @param string roomName 
     * @returns string
     */
    addRandomStringToRoomName(roomName: string): string{
        return  roomName+'-'+crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }
    
    /**
     *
     * @param string: duration : jwt duration like "25m" or "13s"
     * @returns number: seconds represented by duration
     */
    convertJWTDurationToSeconds(duration:string): number {
        const numericPortion: number = parseInt(duration);
        const stringPortionArr = duration.match(/[s|m|h]/g);
        
        if (!stringPortionArr || stringPortionArr.length == 0 || stringPortionArr.length > 1){
            return -1; 
        }

        switch(stringPortionArr[0]){
            case "s": 
                return numericPortion * 1000;
            case "m":
                return numericPortion * 1000 * 60
            case "h":
                return numericPortion * 1000 * 60 * 60; 
            default: 
                return -1;
        }

    }
}

export default CustomJWTSessionService;