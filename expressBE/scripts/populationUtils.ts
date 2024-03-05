/*
	these are a set of lightweight
	functions to populate sql db for testing and demonstration
	purposes. they are not very robust and will need to be 
	reengineered if this project grows. 
*/

import mysql from 'mysql2/promise';
import ReceiptItem from '../types/receiptItem';
import {getUserDataService, getTransactionDataService} from '../serviceSelector'
import { exit } from 'process';


require('dotenv').config();


async function populateDB(dbPool: mysql.Pool) {

	const sqlUserDataService = getUserDataService();
	const sqlTransactionDataService = getTransactionDataService();


    const createUsersQuery = `
    CREATE TABLE users (
        userId int(11) AUTO_INCREMENT NOT NULL,
        firstName varchar(255) NOT NULL, 
        lastName varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE, 
        password varchar(255) NOT NULL,
        dateCreated datetime NOT NULL, 
        dateRegistered datetime,
        PRIMARY KEY(userId)
    );
    `

    const createTransactionsQuery = `
    CREATE TABLE transactions (
        transactionId int(11) AUTO_INCREMENT NOT NULL,
        businessName varchar(255) NOT NULL, 
        initiatorUserId int(11) NOT NULL,
        dateCreated datetime NOT NULL, 
        PRIMARY KEY(transactionId)
    );
    `

    const createTransactionsItemsQuery = `
    CREATE TABLE transactionsItems (
        transactionsItemsId int(11) AUTO_INCREMENT NOT NULL,
        transactionId int(11) NOT NULL,
        userId int(11) NOT NULL,
        username varchar(255) NOT NULL, 
		itemName varchar(255) NOT NULL,
        itemPrice decimal(19,4) NOT NULL DEFAULT 0.00,
        dateCreated datetime NOT NULL DEFAULT NOW(), 
        PRIMARY KEY(transactionsItemsId)
    );
    `

    
    await Promise.all([
        dbPool.execute(createUsersQuery),
         dbPool.execute(createTransactionsQuery),
         dbPool.execute(createTransactionsItemsQuery)
        ]
    );

    console.log('created users table...'); 
    console.log('created transactions table...');
    console.log('created transactionsItems table...'); 


	const testUsers = [
		{
			email: "testUser1@test.com",
			password: "testuser1password",
			firstName: "testUser1",
			lastName : "tester"
		}, 
		{
			email: "testUser2@test.com",
			password: "testuser2password",
			firstName: "testUser2",
			lastName : "tester"
		}, 
		{
			email: "testUser3@test.com",
			password: "testuser3password",
			firstName: "testUser3",
			lastName : "tester"
		}, 
		{
			email: "testUser4@test.com",
			password: "testuser4password",
			firstName: "testUser4",
			lastName : "tester"
		}, 
		{
			email: "testUser5@test.com",
			password: "testuser5password",
			firstName: "testUser5",
			lastName : "tester"
		}, 
	];

	const testUserPromises = testUsers.map( async (u) => await sqlUserDataService.create(u.firstName, u.lastName, u.email, u.password ));
	
	await Promise.all(testUserPromises);


	console.log('created test users...');

	const testTransactions = [
		{
			initiatorUserId: 1, 
			businessName: "business1",
			receiptItemsArray: [
				{
					userId: 1,
					username: "hardcodedusername1", 
					itemName: "tacos",
					itemPrice: 12.99
				} as ReceiptItem,
				{
					userId: 3,
					username: "hardcodedusername1", 
					itemName: "ice cream",
					itemPrice: 5.75
				} as ReceiptItem,
				{
					userId: -1,
					username: "JohnnyB Guest", 
					itemName: "Beer",
					itemPrice: 4.00
				} as ReceiptItem,
			] as [ReceiptItem, ...ReceiptItem[]]
		},
		{
			initiatorUserId: 3, 
			businessName: "business2",
			receiptItemsArray: [
				{
					userId: 3,
					username: "hardcodedusername1", 
					itemName: "Chicken Nuggets",
					itemPrice: 10.99
				} as ReceiptItem,
				{
					userId: -1,
					username: "SallyB Guest", 
					itemName: "Tequila Shot",
					itemPrice: 6.00
				} as ReceiptItem,
				{
					userId: 4,
					username: "hardcodedusername1", 
					itemName: "vegetables",
					itemPrice: 4.00
				} as ReceiptItem,
				{
					userId: 4,
					username: "hardcodedusername1", 
					itemName: "pita bread",
					itemPrice: 3.50
				} as ReceiptItem
			] as [ReceiptItem, ...ReceiptItem[]]
		},
	];


	const testTransactionPromises = testTransactions.map( async (t) =>{
		return await sqlTransactionDataService.create(
			{
				initiatorUserId: t.initiatorUserId,
				businessName: t.businessName,
				receiptItems: t.receiptItemsArray
			}
		); 	
	});

	await Promise.all(testTransactionPromises);
	

	console.log('created test transactions...'); 

    await dbPool.end();

	exit();

}


async function dropTables(tablesToDrop: string[], dbPool: mysql.Pool) {

    let dropPromises = tablesToDrop.map((tableName) => dbPool.execute(`DROP TABLE ${tableName};`));

    await Promise.all(dropPromises);

    console.log(`dropped tables: ${tablesToDrop}`); 


    await dbPool.end();
    
}

async function getDBPool(): Promise<mysql.Pool>{
	let dbParams: {};

	switch(process.env.NODE_ENV){
		case('dev'):
			dbParams = {
				host: process.env.DEV_DB_URL,
				user: process.env.DEV_DB_USER,
				password: process.env.DEV_DB_PASSWORD,
				database: process.env.DEV_DB_DATABASE,
				connectionLimit: process.env.DEV_CONNECTIONLIMIT
			};
			break;
		case('local'):
			dbParams = {
				host: process.env.TEST_DB_URL,
				user: process.env.TEST_DB_USER,
				password: process.env.TEST_DB_PASSWORD,
				database: process.env.TEST_DB_DATABASE,
				connectionLimit: process.env.TEST_CONNECTIONLIMIT
			};
			break;
		default:
			dbParams = {
				host: process.env.DEV_DB_URL,
				user: process.env.DEV_DB_USER,
				password: process.env.DEV_DB_PASSWORD,
				database: process.env.DEV_DB_DATABASE,
				connectionLimit: process.env.DEV_CONNECTIONLIMIT
			};
			break;
	}
	return await mysql.createPool(dbParams); 
}

export {getDBPool, populateDB, dropTables};


