/*
    this only houses the API level errors.
    each subdirectory of 'services' has custom Errors written 
    specific to the technology that service is implemented in.
*/
type CustomContext = {[key:string]: any} | {};

abstract class APIError extends Error {
    readonly responseCode: number;
    readonly path: string; 
    readonly dateTime: string; 
    readonly context: {[key: string]: any} | {};
    readonly logging: boolean; 

    constructor(params: {responseCode: number, path: string, context?: CustomContext, logging?: boolean}, message?: string){
        super(message || "APIError");
        Object.setPrototypeOf(this, APIError.prototype);
 
        this.responseCode = params.responseCode || -1;
        this.path = params.path || "errorpath";
        this.dateTime = new Date().toISOString();
        this.context = params.context || {};
        this.logging = params.logging || true; 
    }
}

class APINotFoundError extends APIError {
    constructor(params: {path: string, logging?: boolean, context?: CustomContext}, message?: string){
        super({
                responseCode: 404,
                path: params.path,
                context: params.context || {},
                logging: params.logging || true
            },
            message || "APINotFoundError"
        );
        Object.setPrototypeOf(this, APINotFoundError.prototype);
    }
}

class APIAlreadyExistsError extends APIError {
    constructor(params: {path: string, logging?: boolean, context?: CustomContext}, message?: string){
        super({
                responseCode: 409,
                path: params.path,
                context: params.context || {},
                logging: params.logging || true
            },
            message || "APIAlreadyExistsError"
        );
        Object.setPrototypeOf(this, APIAlreadyExistsError.prototype);
    }
}

export {
    APIError,
    APINotFoundError,
    APIAlreadyExistsError
};