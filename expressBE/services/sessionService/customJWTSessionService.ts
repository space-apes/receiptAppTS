import SessionService from './sessionService';
import JWTClaims from './jwtClaims';
import {sign, verify} from 'jsonwebtoken'; 
import crypto from 'crypto';



/*
const loginGetToken = async (req:Request,res:Response, next: NextFunction) => {
  const {email, password} = req.body; 


  // retrieve hashed password for userId from db 
  // test if provided password hashed matches hashed password in db 

  try {
    let userFromEmailQuery:string = `
    SELECT * FROM users u 
    WHERE u.email = ?
    `;


    const [rows, fields] = await dbPool.execute(userFromEmailQuery, [email]); 

    // no user found 
    if (rows.length == 0){
      return res.status(401).json({msg: 'invalid credentials'});
    }
   
    // if user found and hashed password matches password in db
    if (await argon2.verify(rows[0]['password'], password)){
	 
    //create JWT
	  let token = sign (
		  {
			userId: rows[0]['userId'],
      username: `${rows[0]['firstName']} ${rows[0]['lastName'].substring(0,1)}.`,
      roomName: getRandomRoomName(),  
		  },

		  process.env.JWT_SECRET as string,
		  {
		    expiresIn: '1h'
		  }
	  );

    //create httpOnly cookie to store jwt 
    res.cookie("jwt", token, {
      maxAge:60000 * 60,
      httpOnly:true,
      //secure:true
    });

    //give success response
    return res.status(200).json({
	  	message: "successfully logged in", 
	  });

    }
    //hashed password does not match db 
    else{
      return res.status(401).json({message: "invalid credentials"});
    }
  } 
  catch(err){
    console.log(err);
  }
}
*/




class CustomJWTSessionService implements SessionService {

    /**
     * createNew: creates a new session
     * 
     * if no userId supplied this is guest session, set userId to -1
     * 
     */

    create(params: {
        userId?: number, 
        displayedName: string, 
        roomName: string
    }): string {

        //set to -1 if no userId supplied 
        const userId = params.userId || -1;
        const {displayedName, roomName} = params; 

        const jwtClaims: JWTClaims = {
            userId : userId,
            displayedName : displayedName,
            roomName:roomName
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
     * CreateNew: creates new session without using 
     * any data from a referral URL for either guests or registered users
     * 
     * takes in user's email and password and returns JWT 
     * with userId and roomName.
     * 
     * if only one of userIdentifier or password is supplied
     *   throw SessionServiceInvalidCredentialsError
     * 
     * if userIdentifier and password are supplied but no user exists
     *    throw SessionServiceInvalidCredentialsError  
     * 
     * if existing user
     *   set displayName using that value
     * else 
     *   set displayName using argument 
     * 
     * @param string userIdentifier 
     * @param string password 
     * @return string jwt with claims: 
     * {
     *   userId: number,
     *   roomName: string, 
     *   exp: date  
     * }
     
    async createNew(params: {userIdentifier?: string, password?: string, roomName: string, displayedName?: string}): string{

        const userIdentifier = params.userIdentifier || '';
        const password = params.password || '';
        const displayedName = params.displayedName || '';
        const {roomName} = params; 


        try {

            //if only supply one of userIdentifier or password, throw error
            if (( !userIdentifier && password) || (userIdentifier && !password)){
                throw new SessionServiceInvalidCredentialsError({
                    logging: true,
                    message: "supplying only one of userIdentifier and password",
                    userIdentifier: userIdentifier,
                    password: password 
                }); 
            }


            //guest case: no updates  
            if (!userIdentifier){
                const jwtClaims: JWTClaims = {
                    userId: -1,
                    displayedName: displayedName,
                    roomName: `${roomName}-${getRandomString()}`
                };

                return sign (
                    jwtClaims,
                    process.env.JWT_SECRET as string,
                    {
                        expiresIn: process.env.JWT_DURATION
                    }
                    
                );
            }

            //registered case: update userId and displayedName
            else {
                const userDataService: UserDataService = await getUserDataService();

                //will throw UserDataServiceNotFoundError if no existing user
                const existingUser = await userDataService.getByUserEmail(userIdentifier); 
                const registeredUserDisplayedName: string =  `${existingUser.firstName} ${existingUser.lastName.substring(0,1)}.`; 

                const jwtClaims: JWTClaims = {
                    userId : existingUser.userId,
                    displayedName : registeredUserDisplayedName,
                    roomName:`${roomName}-${getRandomString()}` 
                }
                return sign(
                    jwtClaims,
                    process.env.JWT_SECRET as string,
                    {
                        expiresIn: process.env.JWT_DURATION
                    }

                );
            }

            
        }catch(err){
            if (err instanceof(UserDataServiceNotFoundError)){
                throw new SessionServiceInvalidCredentialsError({
                    logging: true,
                    message: "no user with those credentials",
                    userIdentifier: userIdentifier,
                    password: password 
                }); 
            }
            else{
                throw err;
            }
        }

    }
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