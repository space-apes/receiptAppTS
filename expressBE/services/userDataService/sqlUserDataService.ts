import User from '../../types/user';
import UserDataServiceInterface from './userDataServiceInterface';
import {
    SqlUserDataServiceNotFoundError, SqlUserDataServiceAlreadyExistsError, UserDataServiceAlreadyExistsError
} from './userDataServiceError';
import mysql from 'mysql2/promise';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import argon2 from 'argon2';

require('dotenv').config();

class SqlUserDataService implements UserDataServiceInterface{

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
     * create new User
     * 
     * @param email : string 
     * @param password : string 
     * @param firstName : string
     * @param lastName : string  
     * @returns Promise<number>: userId of newly persisted User
     */
    async create(firstName: string, lastName: string, email:string, password: string): Promise<number>{
        try {

            //if user with email already exists, throw AlreadyExists error
            let selectQuery = `
            SELECT * FROM users u 
            WHERE u.email = ?
            `;

            const [selectRows] = await this.dbPool.execute(selectQuery, [email]) as RowDataPacket[];
            
            if (selectRows.length > 0){
                throw new SqlUserDataServiceAlreadyExistsError({
                        query: selectQuery,
                        db: process.env.DB_DATABASE as string
                });
            }

            //no User already exists with that email so proceed with creating new User

            const hash = await argon2.hash(password); 
            
            let insertQuery = `
            INSERT INTO users (firstName, lastName, email, password, dateCreated)
            VALUES (?, ?, ?, ?, NOW());
            `; 
            const insertResult = await this.dbPool.execute(insertQuery, [firstName,lastName,email, hash]) as ResultSetHeader[];
            
            return insertResult[0].insertId;
        
        }
        catch(err)
        {
            throw err; 
        }
    }

    /**
     * retrieve user data from userId 
     * 
     * @param userId 
     * @returns Promise<User>
     */

    async getByUserId(userId: number): Promise<User>  {

        try {
            let retrieveQuery = `
            SELECT * FROM users u
            WHERE u.userId = ?
            `;

            const [rows] = await this.dbPool.execute(retrieveQuery, [userId]) as RowDataPacket[];

            if (rows.length == 0){
                throw new SqlUserDataServiceNotFoundError({
                        query: retrieveQuery,
                        db: process.env.DB_DATABASE as string
                });
            }
            else{
                let user: User = {
                    lastName: rows[0].lastName,
                    firstName: rows[0].firstName,
                    email: rows[0].email,
                    userId: rows[0].userId
                }
                return user; 
            }
        }catch(err){
            throw err; 
        }
    }

    /**
     * retrieve user data from userId 
     * 
     * @param email : string
     * @returns Promise<User>
     */

    async getByUserEmail(email: number): Promise<User>  {

        try {
            let retrieveQuery = `
            SELECT * FROM users u
            WHERE u.email = ?
            `;

            const [rows] = await this.dbPool.execute(retrieveQuery, [email]) as RowDataPacket[];

            if (rows.length == 0){
                throw new SqlUserDataServiceNotFoundError({
                        query: retrieveQuery,
                        db: process.env.DB_DATABASE as string
                });
            }
            else{
                let user: User = {
                    lastName: rows[0].lastName,
                    firstName: rows[0].firstName,
                    email: rows[0].email,
                    userId: rows[0].userId
                }
                return user; 
            }
        }catch(err){
            throw err; 
        }
    }

    /**
     * update existing user and return updated User
     * 
     * @param userId: number 
     * @param firstName: ?string 
     * @param lastName: ?string  
     * @param email : ?string
     * @returns Promise<User>: updated user
     */

    async update(userId:number, firstName?: string, lastName?: string, email?: string): Promise<User>{
       
        //to be used for parameterized 
        let paramArray = []; 
        let updateQuery : string = `UPDATE users SET `; 

        if (firstName){
            updateQuery += 'firstName = ?,';
            paramArray.push(firstName);

        }
        if (lastName){
            updateQuery += 'lastName = ?,';
            paramArray.push(lastName);
        }
        if (email){
            updateQuery += 'email = ?,';
            paramArray.push(email);
        }

        //remove last comma
        updateQuery = updateQuery.slice(0,-1).concat(" ");
        updateQuery += `WHERE userId = ?;`;
        paramArray.push(userId);

        try {

            //find current state of user to return at end 
            //this will throw not found error if userId does not match existing User
            let user: User = await this.getByUserId(userId);
           
            //make updates to specific fields
            const updateResult = await this.dbPool.execute(updateQuery, paramArray) as ResultSetHeader[];

            //build returned user from old and updated values
            user = {
                firstName: firstName ? firstName : user.firstName,
                lastName: lastName ? lastName : user.lastName,
                email: email ? email : user.email,
                userId: user.userId
            };

            return user;  
        }catch(err){
            throw err;
        }

    }

    /**
     * 
     * @param userId 
     * @returns Promise<void>
     */

    async delete(userId: number): Promise<void> {
        let deleteQuery : string =`
        DELETE from users u  
        WHERE u.userId = ? 
        `;
        
        try {
            const deleteResult = await this.dbPool.execute(deleteQuery, [userId]) as ResultSetHeader[];
            
            if (deleteResult[0].affectedRows == 0 ) {
                throw new SqlUserDataServiceNotFoundError({
                        query: deleteQuery,
                        db: process.env.DB_DATABASE as string
                });
            }

            return; 
        }catch(err){
            throw err; 
        }
    }

    


}

export default SqlUserDataService; 