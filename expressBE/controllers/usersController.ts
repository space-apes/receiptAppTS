/*
	controller functions for endpoints should not do any business logic for ease of testing. 
	business logic should be moved to a separate library file in src/library/{nameOfResource}.js
	limit endpoint functions to the following: 
	- validate input: if invalid respond 422 with msg "invalid payload"
	- authorize: if unauthorized respond 403 with meg "forbidden"
	- retrieve data 
	* execute library functions for business logic 
	- send response
*/

import {Request, Response} from 'express'; 
import {sign, verify} from 'jsonwebtoken'; 
import {createUser} from '../library/users';
import {getRandomRoomName} from '../library/socket';

const argon2 = require('argon2');
const { dbPool } = require('../db');


const loginGetToken = async (req:Request,res:Response) => {
  const {email, password} = req.body; 

  //if fields not sent, respond 422

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

  /*


/*
  openAPI comment here with shape of expected body 

*/

const registerUser = async (req:Request,res:Response)=>{
  
  const {firstName, lastName, email, password} = req.body;

    //if fields not sent, respond  422 

    //if user already exists, respond 409 

    // otherwise create entry in db 

    const newUserId = await createUser(email, password, firstName, lastName); 



    if (newUserId == -1){
      return res.status(400).json ({msg: 'user not created'});
    }
    else 
    {
      //respond with jwt 
      return res.status(201).json({msg: 'user created successfuly'})
    }


}

/*
const login = (req:Request,res:Response)=>{


}
*/

/*
// 

does the user have access to perform this action on this resource?
i think we can use JWTs here and instead of making an endpoint, let's try to make it so authorization
does not take an extra request.
i think we can make a middleware or do a check on each endpoint hit 
then redirect to login screen if authorization fails 

const authorizeUserFromToken = (userId, token) => {

}
*/

export {
  registerUser,
  loginGetToken
};



