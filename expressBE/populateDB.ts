//const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';

const {createUser} = require('./library/users'); 
const {createTransaction} = require('./library/transactions'); 

require('dotenv').config();

async function main() {

    var dbPool = mysql.createPool({
        host: process.env.DB_URL,
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE, 
        connectionLimit: 10
    }); 

    //create Users Table 
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
        dateCreated datetime NOT NULL, 
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

	testUsers.forEach((u) =>{
		createUser(u.email, u.password, u.firstName, u.lastName); 
	});

	console.log('added test users...');

	const testTransactions = [
		{
			initiatorUserId: 1, 
			businessName: "business1",
			receiptItemsArray: [
				[
					1,
					"hardcodedusername1", 
					"tacos",
					12.99
				],
				[
					3,
					"hardcodedusername1", 
					"ice cream",
					5.75
				],
				[
					-1,
					"JohnnyB Guest", 
					"Beer",
					4.00
				],

			]
		},
		{
			initiatorUserId: 3, 
			businessName: "business2",
			receiptItemsArray: [
				[
					3,
					"hardcodedusername1", 
					"Chicken Nuggets",
					10.99
				],
				[
					-1,
					"SallyB Guest", 
					"Tequila Shot",
					6.00
				],
				[
					4,
					"hardcodedusername1", 
					"vegetables",
					4.00
				],
				[
					4,
					"hardcodedusername1", 
					"pita bread",
					3.50
				]

			]
		},
	];

	testTransactions.forEach((t)=>{
		createTransaction(t.initiatorUserId, t.businessName, t.receiptItemsArray); 	
	});

	console.log('created test transactions...'); 

    await dbPool.end();
    
}

main();
