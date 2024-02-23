import {Router} from 'express'; 
import {
    registerUser,
    loginGetToken,
    getUser,
    updateUser,
    deleteUser
} from './controllers/usersController'; 


/***  USER ROUTES ***/ 
const userRouter = Router();

userRouter.post('/', registerUser);
userRouter.get('/:userId', getUser);
userRouter.post('/login', loginGetToken);
userRouter.put('/:userId', updateUser);
userRouter.delete('/:userId', deleteUser);
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
