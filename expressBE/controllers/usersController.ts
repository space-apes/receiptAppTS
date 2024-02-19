import {Request, Response, NextFunction} from 'express'; 
import {sign, verify} from 'jsonwebtoken'; 
import {createUser} from '../library/users';
import {getRandomRoomName} from '../library/socket';

const argon2 = require('argon2');
const { dbPool } = require('../db');


const loginGetToken = async (req:Request,res:Response, next: NextFunction) => {
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

// to kickstart *s on each line in vscode, start comment with /** 

/**
 * @openapi
 * /api/users/:
 *   post:
 *     summary: creates and persists new User
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName: 
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string 
 *               password:
 *                 type: string  
 *     responses:
 *       '201':
 *         description: successful creation of User
 *         content:
 *           application/json: 
 *             schema:
 *               type: object 
 *               required: 
 *                 - userId
 *                 - msg
 *               properties:
 *                 userId: 
 *                   type: integer
 *                   format: int64
 *                 msg:
 *                   type: string
 *       '400': 
 *         description: catch-all invalid input response
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - msg 
 *                 - userId
 *               properties:
 *                 msg: 
 *                   type: string
 *                 userId: 
 *                   type: integer 
 *                   format: int64
 *  
 */

const registerUser = async (req:Request,res:Response, next:NextFunction)=>{
  
  const {firstName, lastName, email, password} = req.body;

    //if fields not sent, respond  422 

    //if user already exists, respond 409 

    // otherwise create entry in db 

    try{ 
      
      const newUserId = await createUser(email, password, firstName, lastName); 
      
  
      return res.status(201).json(
        {
          userId: newUserId,
          msg: 'user created successfuly'
        }
      );
      
    }catch(err){
      next(err);
    }
  
  }


export {
  registerUser,
  loginGetToken
};



