import { error } from 'console';
import {Request, Response, NextFunction} from 'express';
import {HttpError} from 'express-openapi-validator/dist/framework/types';

const displayRequestsMiddleware  = (req:Request, res: Response, next:NextFunction)=>{
	console.log(`middleware: path: ${req.path}, method: ${req.method}`);
	next();
};


const customErrorHandlerMiddleware  = (err: HttpError, req:Request, res: Response, next:NextFunction)=>{

	res.status(err.status || 500).json({
		message: err.message,
		error: err.errors
	})
};

/* 
authorizeUser = (jsonWebToken) => userId  or -1 if invalid 
*/

export {displayRequestsMiddleware, customErrorHandlerMiddleware};