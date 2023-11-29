import {Router} from 'express'; 
import {registerUser} from './controllers/userController'; 

/*
const {Router} = require('express');

const {
    registerUser
} = require ('./controllers/userController');
*/

// USER ROUTES 
const userRouter = Router();
//register user 
userRouter.post('/register', registerUser);
//get users from transactionId
//get user 
//login
//verify token 

//TRANSACTION ROUTES

export {userRouter};
