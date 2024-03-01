import mysql from 'mysql2/promise';
require('dotenv').config();

//CAN SET YOUR TABLES HERE
const tablesToDrop: string[] = [
    "users",
    "transactions",
    "transactionsItems"
];


async function dropTables() {

    var dbPool = mysql.createPool({
        host: process.env.DB_URL,
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE, 
        connectionLimit: 10, 
    });

    let dropPromises = tablesToDrop.map((tableName) => dbPool.execute(`DROP TABLE ${tableName};`));

    await Promise.all(dropPromises);

    console.log(`dropped tables: ${tablesToDrop}`); 


    await dbPool.end();
    
}

dropTables();

