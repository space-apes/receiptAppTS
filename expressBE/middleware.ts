import {Request, Response, NextFunction} from 'express';

const displayRequestsMiddleware  = (req:Request, res: Response, next:NextFunction)=>{
	console.log(`middleware: path: ${req.path}, method: ${req.method}`);
	next();
}; 

/* 
authorizeUser = (jsonWebToken) => userId  or -1 if invalid 
*/

export {displayRequestsMiddleware};