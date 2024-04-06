abstract class SessionServiceError extends Error {
    readonly dateTime: string;
    readonly logging: boolean; 
    abstract readonly context?: {[key: string]: any} | {};

    constructor(params: {logging: boolean, message: string}){
        const {logging, message} = params; 
        super(message);
        Object.setPrototypeOf(this, SessionServiceError.prototype);
        this.dateTime = new Date().toISOString();
        this.logging = logging;
        //context must be implemented by derived errors

    }
}

class SessionServiceInvalidCredentialsError extends SessionServiceError {
    private readonly _userIdentifier:string;
    private readonly _password: string;

    constructor(params: {
        logging: boolean, 
        message: string,
        userIdentifier?: string, 
        password?: string
    }){
        const {logging, message, userIdentifier, password} = params;
        super({logging: logging, message: message || "SessionServiceInvalidCredentialsError"});
        Object.setPrototypeOf(this, SessionServiceInvalidCredentialsError.prototype);
        
        this._userIdentifier= userIdentifier || '';
        this._password = password || ''; 
    }

    get context() : {[key: string]: any}{
        return {
            userIdentifier: this._userIdentifier,
            password: this._password            
        };
    }
}

export {SessionServiceInvalidCredentialsError}; 