import {dbPool} from '../db';
import argon2 from 'argon2'; 
import {ResultSetHeader} from 'mysql2';

//create new user 

let createUser = async (email:string, password:string, firstName:string, lastName:string)=> {

      try {

        const hash = await argon2.hash(password); 

        let insertUserQuery = `
        INSERT INTO users (firstName, lastName, email, password, dateCreated)
        VALUES (?, ?, ?, ?, NOW());
        `; 
        const insertResult = await dbPool.execute(insertUserQuery, [firstName,lastName,email, hash]) as ResultSetHeader[];

        return insertResult[0].insertId;

		//return insertResult.insertId as number;

        //return newUser[0].userId;

      }
      catch(error)
      {
        throw error; 
      }
}

export {createUser};
