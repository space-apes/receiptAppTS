/*
    context should be pulled from derived class function in case any processing
    needs to occur.

    message should be optional with a default value taken from derived class

    datetime should be set at highest level with current time at instantiation
    follow yyyy-mm-dd string format of sql

    hierarchy example: 

    UserDataService
                  ->UserDataServiceNotFoundError
                                               -> SqlUserDataServiceNotFoundError

*/



abstract class UserDataServiceError extends Error {
    readonly dateTime: string;
    readonly logging: boolean; 
    abstract readonly context?: {[key: string]: any} | {};

    constructor(logging: boolean, message: string){
        super(message);
        Object.setPrototypeOf(this, UserDataServiceError.prototype);
        this.dateTime = new Date().toISOString();
        this.logging = logging;
        //context must be implemented by derived errors

    }
}

abstract class UserDataServiceNotFoundError extends UserDataServiceError {
    constructor(logging: boolean, message: string){
        super(logging, message || "UserDataServiceNotFoundError");
        Object.setPrototypeOf(this, UserDataServiceNotFoundError.prototype);
    }
}

abstract class UserDataServiceAlreadyExistsError extends UserDataServiceError {
    constructor(logging: boolean, message: string){
        super(logging, message || "UserDataServiceAlreadyExistsError");
        Object.setPrototypeOf(this, UserDataServiceAlreadyExistsError.prototype);
    }
}

class SqlUserDataServiceNotFoundError extends UserDataServiceNotFoundError {
    private readonly _query: string; 
    private readonly _db: string; 

    constructor(params: {query: string, db: string, logging?: boolean}, message?: string){
        let logging : boolean =  params.logging || true;        
        super(logging, message || "SqlUserDataServiceNotFoundError");
        Object.setPrototypeOf(this, SqlUserDataServiceNotFoundError.prototype);

        this._query = params.query;
        this._db = params.db;
    }

    get context() : {[key: string]: any}{
        return {
            query: this._query,
            db:  this._db
        };
    }
}


class SqlUserDataServiceAlreadyExistsError extends UserDataServiceAlreadyExistsError {
    private readonly _query: string; 
    private readonly _db: string; 

    constructor(params: {query: string, db: string, logging?: boolean}, message?: string){
        let logging : boolean =  params.logging || true;        
        super(logging, message || "SqlUserDataServiceAlreadyExistsError");
        Object.setPrototypeOf(this, SqlUserDataServiceAlreadyExistsError.prototype);

        this._query = params.query;
        this._db = params.db;
    }

    get context() : {[key: string]: any}{
        return {
            query: this._query,
            db:  this._db
        };
    }
}


export {
    UserDataServiceError,
    UserDataServiceNotFoundError,
    UserDataServiceAlreadyExistsError,
    SqlUserDataServiceNotFoundError,
    SqlUserDataServiceAlreadyExistsError
};