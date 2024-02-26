import {Router} from 'express'; 
import {
    registerUser,
    loginGetToken,
    getUser,
    updateUser,
    deleteUser
} from './controllers/usersController'; 

/*** SESSION ROUTES ***/
//this should definitely be a service in case diff technologies are used
//get new token
//verify token 
//no refresh token endpoint. just get a new token. 

/***  USER ROUTES ***/ 
const userRouter = Router();

userRouter.post('', registerUser);
userRouter.get('/:userId', getUser);
userRouter.post('/login', loginGetToken);
userRouter.put('/:userId', updateUser);
userRouter.delete('/:userId', deleteUser);


/***  TRANSACTION ROUTES ***/
const transactionRouter = Router(); 

//create transaction 
//get transactions from userId 
//get users from transactionId



export {
    userRouter, 
    transactionRouter
};
