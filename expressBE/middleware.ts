import {Request, Response, NextFunction} from 'express';
import {HttpError} from 'express-openapi-validator/dist/framework/types';
import {APIError} from './errors/apiError';

const displayRequestsMiddleware  = (req:Request, res: Response, next:NextFunction)=>{
	console.log(`request monitoring middleware: path: ${req.path}, method: ${req.method}`);
	next();
};

/*
	if API error
		respond 
	if other error	
		respond with 500
*/
const customErrorHandlerMiddleware  = (err: HttpError, req:Request, res: Response, next:NextFunction)=>{

	if (err instanceof APIError){
		if (err.logging){

			//replace this with loggingService.put action
			console.log(`APIError!
			path: ${err.path}
			responseCode: ${err.responseCode}
			context: ${JSON.stringify(err.context)}
			dateTime: ${err.dateTime}
			`);

			return res.status(err.responseCode || 500).json({
				path: err.path
			});
		}
	}
	return res.status(err.status || 500).json({
		message: err.message,
		error: err.errors
	})
};

/* 
authorizeUser = (jsonWebToken) => userId  or -1 if invalid 
*/

export {displayRequestsMiddleware, customErrorHandlerMiddleware};