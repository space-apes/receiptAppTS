/*
	controller functions for endpoints should not do any business logic for ease of testing. 
	business logic should be moved to a separate library file in src/library/{nameOfResource}.js
	limit endpoint functions to the following: 
	- validate input 
	- authorize 
	- retrieve data 
	* execute library functions for business logic 
	- send response
*/

import {Request, Response} from 'express'; 
import {sign, verify} from 'jsonwebtoken'; 
import {createUser} from '../library/users';

const argon2 = require('argon2');
const { dbPool } = require('../db');


const loginGetToken = async (req:Request,res:Response) => {
  const {email, password} = req.body; 
  //if fields not sent, respond 422
  //if password incorrect, respond 401
  //create token
  //respond 201 with token


  // retrieve hashed password for userId from db 
  // test if provided password hashed matches hashed password in db 

  try {
    let userFromEmailQuery:string = `
    SELECT * FROM users u 
    WHERE u.email = ?
    `;

    const [rows, fields] = await dbPool.execute(userFromEmailQuery, [email]); 

    
    if (await argon2.verify(rows[0]['password'], password)){
	  
	  let token = sign (
		  {
			userId: rows[0]['userId'],
		  }, 
		  process.env.JWT_SECRET as string,
		  {
		    expiresIn: '2m'
		  }
	  );

      res.status(200).json({
	  	message: "successfully logged in", 
		jwt: token
	  });
    }
    else{
      res.status(401).json({message: "forbidden"});
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



    /*
      try {

        const hash = await argon2.hash(password); 
        console.log(`hash: ${hash}`);

        let insertUserQuery = `
        INSERT INTO users (firstName, lastName, email, password, dateCreated)
        VALUES (?, ?, ?, ?, NOW());
        `
        dbPool.execute(insertUserQuery, [firstName,lastName,email, hash]);

        res.status(201).json({msg: "created user"});

      }
      catch(error)
      {
        console.log(error);
      }
      */

      // store both  
    // create token 
    // respond with token  201 
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



