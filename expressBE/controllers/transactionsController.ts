import {Request, Response, NextFunction} from 'express';
import Transaction from '../types/transaction';
import TransactionDataService from '../services/transactionDataService/transactionDataService';
import {getTransactionDataService} from '../serviceSelector';
import {
	TransactionDataServiceAlreadyExistsError,
	TransactionDataServiceNotFoundError
}from '../services/transactionDataService/transactionDataServiceError';
import {
	APINotFoundError,
	APIAlreadyExistsError
} from '../errors/apiError';

/**
 * @openapi
 * /api/transactions:
 *   post:
 *     summary: creates and persists new Transaction
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - initiatorUserId
 *               - businessName
 *               - receiptItems
 *             properties:
 *               initiatorUserId: 
 *                 type: integer
 *               businessName:
 *                 type: string
 *               receiptItems:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   required: [userId, username, itemName, itemPrice]
 *                   properties: 
 *                     userId:
 *                       type: integer
 *                     username: 
 *                       type: string
 *                     itemName: 
 *                       type: string  
 *                     itemPrice: 
 *                       type: number
 *                       format: float
 *                       minimum: 0  
 *     responses:
 *       '201':
 *         description: successful creation of Transaction
 *         content:
 *           application/json: 
 *             schema:
 *               type: object 
 *               required: 
 *                 - userId
 *               properties:
 *                 userId: 
 *                   type: integer
 *                   format: int64
 *       '409': 
 *         description: resource already exists
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *               properties:
 *                 path:
 *                   type: string  
 *       '400': 
 *         description: catch-all invalid input response
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               required: 
 *                 - path
 *               properties:
 *                 path:
 *                   type: string  
 *  
 */
const createTransaction = async (req: Request, res: Response, next: NextFunction) => {


	try{

		const transactionDataService : TransactionDataService = await getTransactionDataService(); 
		const newTransactionId = await transactionDataService.create(req.body);

		return res.status(201).json({tranactionId: newTransactionId});

	}catch(err){
		next(err);
	}

}

/**
 * @openapi
 * /api/transactions/{transactionId}:
 *   get:
 *     summary: retrieves Transaction by transactionId
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses: 
 *       '200':
 *         description: successfully retrieved Transaction resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - transactionId
 *                 - initiatorUserId
 *                 - businessName
 *                 - receiptItems
 *               properties: 
 *                 initiatorUserId: 
 *                   type: integer
 *                 businessName:
 *                   type: string
 *                 receiptItems:
 *                   type: array
 *                   items: 
 *                     type: object
 *                     required: [userId, username, itemName, itemPrice]
 *                     properties: 
 *                       userId:
 *                         type: integer
 *                       username: 
 *                         type: string
 *                       itemName: 
 *                         type: string  
 *                       itemPrice: 
 *                         type: number
 *                         format: float
 *                         minimum: 0  
 *       '404':
 *         description: Transaction not found using that URI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 *       '400':
 *         description: catch-all bad request when trying to retrieve Transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 */

const getTransactionByTransactionId = async (req:Request, res: Response, next: NextFunction) => {

	const transactionId: number = parseInt(req.params.transactionId);

	try{
		const transactionDataService = await getTransactionDataService();
		const transaction: Transaction = await transactionDataService.getByTransactionId(transactionId);

		return res.status(200).json(transaction);
	}catch(err){

		if (err instanceof TransactionDataServiceNotFoundError){
			  const apiErrorParams = {
				path: req.originalUrl,
				logging: true,
				context: err.context
			};
			throw new APINotFoundError(apiErrorParams);
		}
		else{
			next(err);
		}
	}
}

/**
 * @openapi
 * /api/transactions/user/{userId}:
 *   get:
 *     summary: retrieves all Transactions user participated in
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses: 
 *       '200':
 *         description: successfully retrieved Transaction resource(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [transactionId, initiatorUserId, businessName, receiptItems]
 *                 properties:
 *                   transactionId:
 *                     type: integer
 *                   initiatorUserId: 
 *                     type: integer
 *                   businessName:
 *                     type: string
 *                   receiptItems:
 *                     type: array
 *                     items: 
 *                       type: object
 *                       required: [userId, username, itemName, itemPrice]
 *                       properties: 
 *                         userId:
 *                           type: integer
 *                         username: 
 *                           type: string
 *                         itemName: 
 *                           type: string  
 *                         itemPrice: 
 *                           type: number
 *                           format: float
 *                           minimum: 0  
 *       '404':
 *         description: Transaction(s) not found using that URI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 *       '400':
 *         description: catch-all bad request when trying to retrieve Transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - path
 *               properties:
 *                 path: 
 *                   type: string 
 */

const getTransactionsByUserId = async (req:Request, res: Response, next: NextFunction) => {

	const userId: number = parseInt(req.params.userId);

	try{

		const transactionDataService = await getTransactionDataService();
		const transactions: Transaction[] = await transactionDataService.getAllByUserId(userId);


		return res.status(200).json(transactions);
	}catch(err){

		if (err instanceof TransactionDataServiceNotFoundError){
			  const apiErrorParams = {
				path: req.originalUrl,
				logging: true,
				context: err.context
			};
			throw new APINotFoundError(apiErrorParams);
		}
		else{
			next(err);
		}
	}
}


/*
create new transaction. only initiator can do this. 
 requires:
  - number initiatorUserId
  - string businessName
  - [{itemName:string, itemPrice:number, userIdOfPayer:number}] receiptItems : 

let createTransaction(req:Request, res:response):Response => {
	// maybe check if a transaction was attempted to be created 
	// within last 5 minutes so people don't accidentally double submit..

	const {initiatorUserId, businessName, receiptItems} = req.body; 

	const transactionInsertQuery = `
	INSERT INTO transactions

	`;

	const transaction

	// don't forget date created 
}
*/

export {
	createTransaction,
	getTransactionByTransactionId,
	getTransactionsByUserId
};