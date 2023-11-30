import {dbPool} from '../db';
import argon2 from 'argon2'; 
import {ResultSetHeader} from 'mysql2';
import {ReceiptItemType} from '../types';

/*
    //create new transaction
    - intiatorUserId 
    - businessName 
    - receiptItemsArray 


*/
let createTransaction = async (initiatorUserId:number, businessName:string, receiptItemsArray:[[number, string, string, number]])=> {
    //insert transaction first to get the transactionId 
    // then insert the set of transactionItems 

      try {

        let insertTransactionQuery = `
        INSERT INTO transactions (initiatorUserId, businessName, dateCreated)
        VALUES (?, ?,  NOW());
        `;
        const insertTransactionResult = await dbPool.execute(insertTransactionQuery, [initiatorUserId, businessName]) as ResultSetHeader[];

        const newTransactionId = insertTransactionResult[0].insertId;

        receiptItemsArray.forEach((i) => i.push(newTransactionId));

        console.log('receiptItems after adding transactionId');
        console.log(receiptItemsArray);

        let insertTransactionItemsQuery = `
        INSERT INTO transactionsItems (userId, username, itemName, itemPrice, transactionId)
        VALUES (?); 
        `;


        await dbPool.execute(insertTransactionItemsQuery, [receiptItemsArray]);

        return newTransactionId; 

      }
      catch(error)
      {
        console.log(error);
        return -1; 
      }
}

export {createTransaction};