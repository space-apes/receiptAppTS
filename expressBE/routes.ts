import {Router} from 'express'; 
import {
    registerUser,
    loginGetToken
} from './controllers/usersController'; 


/***  USER ROUTES ***/ 
const userRouter = Router();

userRouter.post('/user', registerUser);
userRouter.post('/login', loginGetToken);
//verify token 



/***  TRANSACTION ROUTES ***/
const transactionRouter = Router(); 

//create transaction 
//get transactions from userId 
//get users from transactionId



export {
    userRouter, 
    transactionRouter
};
