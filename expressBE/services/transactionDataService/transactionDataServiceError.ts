/*
    context should be pulled from derived class function in case any processing
    needs to occur.

    message should be optional with a default value taken from derived class

    datetime should be set at highest level with current time at instantiation
    follow yyyy-mm-dd string format of sql

    hierarchy example: 

    TransactionDataService
                  ->TransactionDataServiceNotFoundError
                                               -> SqlTransactionDataServiceNotFoundError

*/



abstract class TransactionDataServiceError extends Error {
    readonly dateTime: string;
    readonly logging: boolean; 
    abstract readonly context?: {[key: string]: any} | {};

    constructor(logging: boolean, message: string){
        super(message);
        Object.setPrototypeOf(this, TransactionDataServiceError.prototype);
        this.dateTime = new Date().toISOString();
        this.logging = logging;
        //context must be implemented by derived errors

    }
}

abstract class TransactionDataServiceNotFoundError extends TransactionDataServiceError {
    constructor(logging: boolean, message: string){
        super(logging, message || "TransactionDataServiceNotFoundError");
        Object.setPrototypeOf(this, TransactionDataServiceNotFoundError.prototype);
    }
}

abstract class TransactionDataServiceAlreadyExistsError extends TransactionDataServiceError {
    constructor(logging: boolean, message: string){
        super(logging, message || "TransactionDataServiceAlreadyExistsError");
        Object.setPrototypeOf(this, TransactionDataServiceAlreadyExistsError.prototype);
    }
}

class SqlTransactionDataServiceNotFoundError extends TransactionDataServiceNotFoundError {
    private readonly _query: string; 
    private readonly _db: string;
    private readonly _dbVars: any[];

    constructor(params: {query: string, db: string, dbVars: any[], logging?: boolean}, message?: string){
        let logging : boolean =  params.logging || true;        
        super(logging, message || "SqlTransactionDataServiceNotFoundError");
        Object.setPrototypeOf(this, SqlTransactionDataServiceNotFoundError.prototype);

        this._query = params.query;
        this._db = params.db;
        this._dbVars = params.dbVars
    }

    get context() : {[key: string]: any}{
        return {
            query: this._query,
            db:  this._db,
            dbVars: this._dbVars
        };
    }
}


class SqlTransactionDataServiceAlreadyExistsError extends TransactionDataServiceAlreadyExistsError {
    private readonly _query: string; 
    private readonly _db: string;
    private readonly _dbVars: any[];

    constructor(params: {query: string, db: string, dbVars: any[], logging?: boolean}, message?: string){
        let logging : boolean =  params.logging || true;        
        super(logging, message || "SqlTransactionDataServiceAlreadyExistsError");
        Object.setPrototypeOf(this, SqlTransactionDataServiceAlreadyExistsError.prototype);

        this._query = params.query;
        this._db = params.db;
        this._dbVars = params.dbVars
    }

    get context() : {[key: string]: any}{
        return {
            query: this._query,
            db:  this._db,
            dbVars: this._dbVars
        };
    }
}


export {
    TransactionDataServiceError,
    TransactionDataServiceNotFoundError,
    TransactionDataServiceAlreadyExistsError,
    SqlTransactionDataServiceNotFoundError,
    SqlTransactionDataServiceAlreadyExistsError
};