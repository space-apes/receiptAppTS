import Transaction from '../../types/transaction';
import ReceiptItem from '../../types/receiptItem';
import TransactionDataService from './transactionDataService';
import UserDataService from '../userDataService/userDataService';
import {getUserDataService} from '../../serviceSelector';
import {
    SqlTransactionDataServiceNotFoundError, 
    SqlTransactionDataServiceAlreadyExistsError, 
    TransactionDataServiceAlreadyExistsError
} from './transactionDataServiceError';

import mysql from 'mysql2/promise';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

require('dotenv').config();


class SqlTransactionDataService implements TransactionDataService{

     dbPool: mysql.Pool;

    constructor(){
        this.dbPool = mysql.createPool({
            host: process.env.DB_URL,
            user: process.env.DB_USER, 
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE, 
            connectionLimit: 10
        }); 
    }

    /**
     * 
     * @param Object params:  object containing required data for a transaction with fields
     *   - number initiatorUserId: userId of user who initiated the transaction (and will submit it to be persisted)
     *   - string businessName
     *   - receiptItems[]: non-empty array of ReceiptItem elements 
     * @returns Promise<number> : new transactionId 
     */

    async create(params: { initiatorUserId: number, businessName: string, receiptItems: [ReceiptItem, ...ReceiptItem[]] }): Promise<number> {
        const {initiatorUserId, businessName, receiptItems} = params;

        try {

            //initiatorUserId must exist or GUEST_USER_ID or throw error 
            if (initiatorUserId != -1){

                const userDataService: UserDataService = getUserDataService();
                //this will throw error if initiatorUser is not found
                userDataService.getByUserId(initiatorUserId);

            }

            let currentQuery = `
            INSERT INTO transactions (initiatorUserId, businessName, dateCreated)
            VALUES (?, ?,  NOW());
            `;

            const insertTransactionResult = await this.dbPool.execute(currentQuery, [initiatorUserId, businessName]) as ResultSetHeader[];

            const newTransactionId = insertTransactionResult[0].insertId;

            // add transactionId to each receiptItem and convert to array of arrays for mysql2 
            const receiptItemsWithTransactionId = receiptItems.map(item =>{ 
                return [item.userId, item.username, item.itemName, item.itemPrice, newTransactionId]
             });


            currentQuery = `
            INSERT INTO transactionsItems (userId, username, itemName, itemPrice, transactionId)
            VALUES ?; 
            `;


            await this.dbPool.query(currentQuery, [receiptItemsWithTransactionId]);

            return newTransactionId;

        }
        catch (err) {
            throw err; 
        }
    }

    /**
     * 
     * @param transactionId 
     * @returns Promise<transaction>
     */

    async getByTransactionId(transactionId: number): Promise<Transaction> {

        try {
            
            const query: string = `
            SELECT * from transactions t
            JOIN transactionsItems ti on t.transactionId = ti.transactionId
            WHERE t.transactionId = ?;
            `;

            if (transactionId < 1){
                throw new SqlTransactionDataServiceNotFoundError({
                        query: query,
                        db: process.env.DB_DATABASE as string
                });
            }


            const [transactionRows] = await this.dbPool.execute(query, [transactionId]) as RowDataPacket[];

            if (transactionRows.length == 0){
                throw new SqlTransactionDataServiceNotFoundError({
                        query: query,
                        db: process.env.DB_DATABASE as string
                });
            }
            else{
                
                const initiatorUserId : number = transactionRows[0].transactionId;
                const businessName : string = transactionRows[0].businessName;
                const dateCreated : string = transactionRows[0].dateCreated;
                
                let receiptItems : ReceiptItem[] = transactionRows.map((row: any)=>{
                    let receiptItem : ReceiptItem = {
                        userId: row.userId,
                        username: row.username,
                        itemName: row.itemName,
                        itemPrice: parseFloat(row.itemPrice)
                    }
                    return receiptItem;
                });

                const transaction : Transaction = {
                    initiatorUserId: initiatorUserId,
                    businessName: businessName,
                    receiptItems: receiptItems,
                    dateCreated: dateCreated,
                    transactionId: transactionId
                };

                return transaction;
            }

        }catch(err){
            throw err; 
        }
    }

    /**
     * 
     * @param number userId 
     * @returns Promise<Transaction[]>: all transactions that the user with userId participated in
     */

    async getAllByUserId(userId: number): Promise<Transaction[]>{

        let query = `
        SELECT * FROM transactions t 
        JOIN transactionsItems ti ON ti.transactionId = t.transactionId
        WHERE t.transactionId IN  
            (SELECT DISTINCT(tii.transactionId) 
            FROM transactionsItems tii	
            WHERE tii.userId = ?);	
        `;


        try {
            if (userId < 1){
                throw new SqlTransactionDataServiceNotFoundError({
                        query: query,
                        db: process.env.DB_DATABASE as string
                });
            }

            const [transactionRows] = await this.dbPool.execute(query, [userId]) as RowDataPacket[];

            if (transactionRows.length == 0){
                throw new SqlTransactionDataServiceNotFoundError({
                        query: query,
                        db: process.env.DB_DATABASE as string
                });
            }


            //build the transactions but don't enforce Transaction type until end
            //so that everything can be grouped by transactionId and no errors with missing fields/partial types until Transaction is fully built
            let groupedTransactionData: {[key: number]: any} = {};

            transactionRows.forEach((row: any) =>{
                const rowTransactionId: number = parseInt(row.transactionId);

                if (!groupedTransactionData[rowTransactionId]){
                    groupedTransactionData[rowTransactionId] = {
                        transactionId: rowTransactionId,
                        initiatorUserId: row.initiatorUserId,
                        businessName: row.businessName,
                        dateCreated: row.dateCreated,
                        receiptItems: [] as ReceiptItem[]
                    }
                }
                
                groupedTransactionData[rowTransactionId].receiptItems.push({
                    itemName: row.itemName,
                    itemPrice: parseFloat(row.itemPrice),
                    username: row.username,
                    userId: parseInt(row.userId)
                } as ReceiptItem);
                
            });

            
            let transactions: Transaction[] = [];
            for( let key in groupedTransactionData){
                transactions.push({
                    transactionId: groupedTransactionData[key].transactionId,
                    initiatorUserId: groupedTransactionData[key].initiatorUserId,
                    businessName: groupedTransactionData[key].businessName,
                    dateCreated: groupedTransactionData[key].dateCreated,
                    receiptItems: groupedTransactionData[key].receiptItems
                } as Transaction);
            }

            return transactions; 
            
        }catch(err){
            throw err; 
        }
    }

    /**
     * deletes all transactions and transactionsItems rows associated
     * with given transactionId
     * 
     * @param number transactionId 
     * @returns void
     */

    async delete(transactionId: number): Promise<void> {
        const query: string = `
        DELETE transactions, transactionsItems
        FROM transactions
        INNER JOIN transactionsItems on transactions.transactionId = transactionsItems.transactionId
        WHERE transactionid = ?;
        `;

        
        try {

            if (transactionId < 1){
                throw new SqlTransactionDataServiceNotFoundError({
                        query: query,
                        db: process.env.DB_DATABASE as string
                });
            }

            const deleteResult = await this.dbPool.execute(query, [transactionId]) as ResultSetHeader[];
            
            if (deleteResult[0].affectedRows == 0 ) {
                throw new SqlTransactionDataServiceNotFoundError({
                        query: query,
                        db: process.env.DB_DATABASE as string
                });
            }
        return; 
        }catch(err){
            throw err; 
        }
    }
}

export default SqlTransactionDataService;
