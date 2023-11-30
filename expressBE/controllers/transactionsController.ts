/*
	controller functions for endpoints should not do any business logic for ease of testing. 
	business logic should be moved to a separate library file in src/library/{nameOfResource}.js
	limit endpoint functions to the following: 
	- validate input 
	- authorize 
	- retrieve data 
	* execute library functions for business logic 
	- send response
*/

import {Request, Response} from 'express'; 




// get transactions for userId
let transactionsFromUserId = (req:Request, res:Response):Response => {
	
	return res.json({msg: 'transactionsFromuserId stub response'});

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
