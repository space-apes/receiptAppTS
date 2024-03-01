import {Request, Response, NextFunction} from 'express'; 
import {sign, verify} from 'jsonwebtoken'; 
import {getRandomRoomName} from '../library/socket';
import User from '../types/user'; 
import UserDataService from '../services/userDataService/userDataService';
import {getUserDataService} from '../serviceSelector';
import { 
  UserDataServiceAlreadyExistsError,
  UserDataServiceNotFoundError
} from '../services/userDataService/userDataServiceError';
import {
  APINotFoundError,
  APIAlreadyExistsError
} from '../errors/apiError';
import dotenv from 'dotenv';
import {dbPool} from '../db';


dotenv.config(); 
const argon2 = require('argon2');

//get UserDataService based on environment 
const userDataService : UserDataService = getUserDataService(); 


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

// to kickstart *s on each line in vscode, start comment with /** 

/**
 * @openapi
 * /api/users:
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
 *               properties:
 *                 userId: 
 *                   type: integer
 *                   format: int64
 *       '409': 
 *         description: resource already exists
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *               properties:
 *                 path:
 *                   type: string  
 *       '400': 
 *         description: catch-all invalid input response
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *               properties:
 *                 path:
 *                   type: string  
 *  
 */

const registerUser = async (req:Request,res:Response, next:NextFunction)=>{
  
  const {firstName, lastName, email, password} = req.body;

    try{ 
      
      let newUserId = await userDataService.create(firstName, lastName, email, password); 
  
      return res.status(201).json(
        {
          userId: newUserId
        }
      );

    }catch(err){
      if (err instanceof UserDataServiceAlreadyExistsError){

        const apiErrorParams = {
          path: req.originalUrl,
          logging: true,
          context: err.context
        };

        next(new APIAlreadyExistsError(apiErrorParams));
      }
      else{
        next(err);
      }

    }
  
  }

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: retrieves User by userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses: 
 *       '200':
 *         description: successfully retrieved user resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - lastName
 *                 - firstName
 *                 - userId
 *                 - email
 *               properties:
 *                 lastName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 email: 
 *                   type: string
 *       '404':
 *         description: user resource not found using that URI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 */

  const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId); 

    try {

      const user: User = await userDataService.getByUserId(userId);
     
      return res.status(200).json(user);

    }catch(err){

      if (err instanceof UserDataServiceNotFoundError){

        const apiErrorParams = {
          path: req.originalUrl,
          logging: true,
          context: err.context
        };

        next(new APINotFoundError(apiErrorParams));
      }
      else{
        next(err);
      }
    }

  }

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     summary: retrieves User by userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               firstName: 
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses: 
 *       '200':
 *         description: successfully updated User resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - lastName
 *                 - firstName
 *                 - userId
 *                 - email
 *               properties:
 *                 lastName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 email: 
 *                   type: string
 *       '404':
 *         description: user resource not found using that URI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 *       '400':
 *         description: invalid request 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 */
  const updateUser = async (req: Request, res: Response, next: NextFunction) => {

    const lastName: string | undefined = req.body.lastName ? req.body.lastName : null;
    const firstName: string | undefined = req.body.firstName ? req.body.firstName : null;
    const email: string | undefined = req.body.email ? req.body.email : null;
    const userId : number = req.params.userId ? parseInt(req.params.userId) : -1;

    try{

      let updatedUser : User = await userDataService.update(userId, firstName, lastName, email);
      return res.status(200).json(updatedUser);

    }
    catch(err){
      if (err instanceof UserDataServiceNotFoundError){

        const apiErrorParams = {
          path: req.originalUrl,
          logging: true,
          context: err.context
        };

        next(new APINotFoundError(apiErrorParams));
      }
      else{
        next(err);
      }
    }
  }


/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     summary: delete User by userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses: 
 *       '204':
 *         description: successfully deleted user resource
 *       '404': 
 *         description: resource not found
 */
  const deleteUser = async (req: Request, res: Response, next: NextFunction)  => {
    
    let userId : number = parseInt(req.params.userId);

    try {
      userDataService.delete(userId);

      return res.status(204);
    }catch(err){
      next(err);
    }
  }


export {
  getUser,
  registerUser,
  updateUser,
  deleteUser
};



