import {Router} from 'express'; 
import {
    registerUser,
    getUser,
    updateUser,
    deleteUser
} from './controllers/usersController';
import {
    createTransaction,
    getTransactionByTransactionId,
    getTransactionsByUserId
} from './controllers/transactionsController';
import {
    createGuestSession,
    createRegisteredSession
} from './controllers/sessionsController';

/*** SESSION ROUTES ***/
const sessionsRouter = Router();
sessionsRouter.post('/createGuestSession', createGuestSession)
sessionsRouter.post('/createRegisteredSession', createRegisteredSession)
//sessionRouter.post('/login', loginGetToken);
//verify token 
//no refresh token endpoint. just get a new token. 

/***  USER ROUTES ***/ 
const usersRouter = Router();

usersRouter.post('', registerUser);
usersRouter.get('/:userId', getUser);
usersRouter.put('/:userId', updateUser);
usersRouter.delete('/:userId', deleteUser);


/***  TRANSACTION ROUTES ***/
const transactionsRouter = Router();
transactionsRouter.post('', createTransaction);
transactionsRouter.get('/:transactionId', getTransactionByTransactionId);
transactionsRouter.get('/user/:userId', getTransactionsByUserId);

//create transaction 
//get transactions from userId 
//get users from transactionId



export {
    usersRouter, 
    transactionsRouter,
    sessionsRouter
};
