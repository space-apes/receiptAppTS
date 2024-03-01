import UserDataService from './services/userDataService/userDataService';
import SqlUserDataService from './services/userDataService/sqlUserDataService';
import TransactionDataService from './services/transactionDataService/transactionDataService';
import SqlTransactionDataService from './services/transactionDataService/sqlTransactionDataService';

function getUserDataService(): UserDataService{

    let userDataService : UserDataService;

    switch (process.env.NODE_ENV){
    //case 'local': 
    //  userDataService = new InMemoryUserDataService(); 
    case 'dev': 
        userDataService = new SqlUserDataService();
        break;
    default: 
        userDataService = new SqlUserDataService(); 
    }

    return userDataService;
}

function getTransactionDataService(): TransactionDataService{

    let transactionDataService : TransactionDataService;

    switch (process.env.NODE_ENV){
    //case 'local': 
    //  transactionDataService = new InMemoryTransactionDataService(); 
    case 'dev': 
        transactionDataService = new SqlTransactionDataService();
        break;
    default: 
        transactionDataService = new SqlTransactionDataService(); 
    }

    return transactionDataService;
}

export {getUserDataService, getTransactionDataService}; 