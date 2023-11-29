const mysql = require('mysql2/promise');
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
        dateCreated datetime, 
        PRIMARY KEY(userId)
    );
    `

    const createTransactionsQuery = `
    CREATE TABLE transactions (
        transactionId int(11) AUTO_INCREMENT NOT NULL,
        businessName varchar(255) NOT NULL, 
        initiatorUserId int(11) NOT NULL,
        dateCreated datetime, 
        PRIMARY KEY(transactionId)
    );
    `
    await Promise.all([
        dbPool.execute(createUsersQuery),
         dbPool.execute(createTransactionsQuery)
        ]
    );

    await dbPool.end();
    
    console.log('created users table...'); 
    console.log('created transactions table...'); 
}

main();