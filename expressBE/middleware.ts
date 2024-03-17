import express, {Express, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import {HttpError} from 'express-openapi-validator/dist/framework/types';
import {APIError} from './errors/apiError';
import {openAPIDocJSONObj} from './library/openAPIDoc';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import fs from 'fs'; 
import {
    usersRouter,
    transactionsRouter
} from './routes';

//simply displays requests in console for running express app
const displayRequestsMiddleware  = (req:Request, res: Response, next:NextFunction)=>{
	console.log(`request monitoring middleware: path: ${req.path}, method: ${req.method}`);
	next();
};

const customErrorHandlerMiddleware  = (err: HttpError, req:Request, res: Response, next:NextFunction)=>{

	if (err instanceof APIError){
		if (err.logging){


            //eventually want to log this information
            //through logging service but not reveal too much
            //to the consumer of the API
            //but for now just console.log it

			console.log(`APIError!
			path: ${err.path}
			responseCode: ${err.responseCode}
			context: ${JSON.stringify(err.context)}
			dateTime: ${err.dateTime}
			stack: ${err.stack}
			`);

			return res.status(err.responseCode || 500).json({
				path: err.path
			});
		}
	}
    else{
			console.log(`GenericError!
            message: ${err.message}
            error: ${err.errors}
            stack: ${err.stack}
			`);


    
        return res.status(err.status || 500).json({
            message: err.message,
            error: err.errors,
        });
    }
};

/* 
authorizeUser = (jsonWebToken) => userId  or -1 if invalid 
*/

/*
    all of the initial setup and config for attaching middleware 
    to express app. this is a function so it can be used
    to recreate middlewares in app when testing. 
*/

function attachMiddleware(app: Express) : Express {

    //write openAPISpec.json from object generated by js-doc to file 
    //to be consumed by open-api-validator
    fs.writeFile('openApiSpec.json', JSON.stringify(openAPIDocJSONObj), (err) =>{
        if (err) throw err;
        console.log("successfully wrote openAPISpec json file");
    })




    //main app middleware
    app.use([
        cors({origin: "*"}),
        displayRequestsMiddleware,
        express.json(),
        express.text(),
        express.urlencoded({extended: false})
    ]);


    //validator middleware

    app.use(
        OpenApiValidator.middleware({
            apiSpec: './openApiSpec.json',
            validateRequests: true, 
            validateResponses: true,
            ignorePaths: /.*\/api-docs\/.*/
        })
    );

    //basic test route 
    app.get('/', (req:Request, res:Response) => {
        res.status(200).json({'msg:': 'the rootest path. express + typescript server! woohoo!'}); 
    });

    //users routes
    app.use('/api/users', [express.json(), usersRouter]); 

    //transactions routes
    app.use('/api/transactions', [express.json(), transactionsRouter]); 

    //openAPI documentation routes
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocJSONObj));


    // custom error handling middleware 
    app.use(customErrorHandlerMiddleware);

    return app;

}


export {displayRequestsMiddleware, customErrorHandlerMiddleware, attachMiddleware};