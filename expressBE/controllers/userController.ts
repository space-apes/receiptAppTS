//PULL LOGIC INTO LIBRARY FILE!
//validate, pull data, call library helper function, provide response


import {Request, Response} from 'express'; 

const argon2 = require('argon2');
const { dbPool } = require('../db');

const loginGetToken = (req:Request,res:Response) => {
    
    //if fields not sent, respond 422
    //if password incorrect, respond 401
    //create token
    //respond 201 with token

} 

/*
  openAPI comment here with shape of expected body 

*/

const registerUser = async (req:Request,res:Response)=>{
  
  const {firstName, lastName, email, password} = req.body;

    //if fields not sent, respond  422 

    //if user already exists, respond 409 

    // otherwise create entry in db 
      
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

      // store both  
    // create token 
    // respond with token  201 
}

/*
const login = (req:Request,res:Response)=>{


}
*/

/*
const authorizeUserFromToken = (userId, token) => {

}
*/

export {registerUser};



