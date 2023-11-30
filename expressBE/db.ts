/*
    shared connectionpool across the app
*/

//var mysql = require('mysql2/promise');

import mysql from 'mysql2/promise'; 

require('dotenv').config();
 
 var dbPool = mysql.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, 
    connectionLimit: 10
}); 


export {dbPool};
