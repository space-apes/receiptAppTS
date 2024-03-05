/*
    this is a very high level set of simple functions
    used to instantiate the correct implementation of services
    based on the development environment. it is not meant to be complicated 
    and i was hoping it would be simple enough to basically be descriptive.

    for example: the UserDataService has an SQL implementation
    and an AWS Cognito implementation is planned for production. 
    
    if the environment variable NODE_ENV is set to 'dev'
    the getUserDataService returns an instance of SQL UserDataService 


    getUserDataService
    getTransactionDataService

*/

import UserDataService from './services/userDataService/userDataService';
import SqlUserDataService from './services/userDataService/sqlUserDataService';
import TransactionDataService from './services/transactionDataService/transactionDataService';
import SqlTransactionDataService from './services/transactionDataService/sqlTransactionDataService';

function getUserDataService(): UserDataService{

    let userDataService : UserDataService;

    switch (process.env.NODE_ENV){
    //case local: 
    //  userDataService = new InMemoryUserDataService(); 
    case 'test': 
        userDataService = new SqlUserDataService({
            host: process.env.TEST_DB_URL as string,
            user: process.env.TEST_DB_USER as string,
            password: process.env.TEST_DB_PASSWORD as string, 
            database: process.env.TEST_DB_DATABASE as string,
            connectionLimit: parseInt(process.env.TEST_DB_CONNECTIONLIMIT as string) as number
        });
        break;
    case 'dev': 
        userDataService = new SqlUserDataService({
            host: process.env.DEV_DB_URL as string,
            user: process.env.DEV_DB_USER as string,
            password: process.env.DEV_DB_PASSWORD as string, 
            database: process.env.DEV_DB_DATABASE as string,
            connectionLimit: parseInt(process.env.DEV_DB_CONNECTIONLIMIT as string) as number
        });
        break;
    default: 
        userDataService = new SqlUserDataService({
            host: process.env.DEV_DB_URL as string,
            user: process.env.DEV_DB_USER as string,
            password: process.env.DEV_DB_PASSWORD as string, 
            database: process.env.DEV_DB_DATABASE as string,
            connectionLimit: parseInt(process.env.DEV_DB_CONNECTIONLIMIT as string) as number
        });
    }

    return userDataService;
}

function getTransactionDataService(): TransactionDataService{

    let transactionDataService : TransactionDataService;

    switch (process.env.NODE_ENV){
    //case 'local': 
    //  transactionDataService = new InMemoryTransactionDataService(); 
    case 'test': 
        transactionDataService = new SqlTransactionDataService({
            host: process.env.TEST_DB_URL as string,
            user: process.env.TEST_DB_USER as string,
            password: process.env.TEST_DB_PASSWORD as string, 
            database: process.env.TEST_DB_DATABASE as string,
            connectionLimit: parseInt(process.env.TEST_DB_CONNECTIONLIMIT as string) as number
        });
        break;
    case 'dev': 
        transactionDataService = new SqlTransactionDataService({
            host: process.env.DEV_DB_URL as string,
            user: process.env.DEV_DB_USER as string,
            password: process.env.DEV_DB_PASSWORD as string, 
            database: process.env.DEV_DB_DATABASE as string,
            connectionLimit: parseInt(process.env.DEV_DB_CONNECTIONLIMIT as string) as number
        });
        break;
    default: 
        transactionDataService = new SqlTransactionDataService({
            host: process.env.DEV_DB_URL as string,
            user: process.env.DEV_DB_USER as string,
            password: process.env.DEV_DB_PASSWORD as string, 
            database: process.env.DEV_DB_DATABASE as string,
            connectionLimit: parseInt(process.env.DEV_DB_CONNECTIONLIMIT as string) as number
        });
    }

    return transactionDataService;
}

export {getUserDataService, getTransactionDataService}; 