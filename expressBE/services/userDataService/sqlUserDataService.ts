import User from '../../types/user';
import UserDataService from './userDataService';
import {
    SqlUserDataServiceNotFoundError, 
    SqlUserDataServiceAlreadyExistsError,
    UserDataServiceError, 
} from './userDataServiceError';
import mysql from 'mysql2/promise';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import argon2 from 'argon2';


class SqlUserDataService implements UserDataService{

     private dbPool: mysql.Pool;

    constructor(params: {host: string, user: string, password: string, database: string, connectionLimit: number}){
        this.dbPool = mysql.createPool({
            host: params.host,
            user: params.user, 
            password: params.password,
            database: params.database, 
            connectionLimit: params.connectionLimit
        }); 
    }

    async close() {
        this.dbPool.end()
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

            let dbVars = [email];

            const [selectRows] = await this.dbPool.execute(selectQuery, dbVars) as RowDataPacket[];
           
            if (selectRows.length > 0){
                throw new SqlUserDataServiceAlreadyExistsError({
                        query: selectQuery,
                        db: process.env.DB_DATABASE as string,
                        dbVars: dbVars
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
            this.close();
            throw err; 
        }
    }

    /**
     * retrieve user data from userId 
     * 
     * @param number userId 
     * @returns Promise<User>
     */

    async getByUserId(userId: number): Promise<User>  {

        try {
            let retrieveQuery = `
            SELECT * FROM users u
            WHERE u.userId = ?
            limit 1;
            `;

            let dbVars : any[] = [userId];

            const [rows] = await this.dbPool.execute(retrieveQuery, dbVars) as RowDataPacket[];

            if (rows.length == 0){
                throw new SqlUserDataServiceNotFoundError({
                        query: retrieveQuery,
                        db: process.env.DB_DATABASE as string,
                        dbVars: dbVars
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
            this.close();
            throw err; 
        }
    }

    /**
     * 
     * @param number[] userIds : set of integers we want to test to see if they correspond with valid existing userIds in users table
     * @returns boolean: true if all given userIds match existing users, false if not
     */
    async usersExistById(userIds: number[]): Promise<Boolean>{
    
        
        //need to insert correct number of question marks for 
        //prepared statement parameterization with "IN" mysql clause
        //using this mySQL client and .execute() method
        let questionMarkString: string = "";
        for (let i = 0; i < userIds.length; i++){
            questionMarkString+="?,"
        }

        //remove last comma 
        questionMarkString = questionMarkString.substring(0, questionMarkString.length -1);

        try {

        if (userIds.length ==0)
            throw new Error("sqlUserDataService:: empty userIds");

            const userCountQuery = `
                SELECT COUNT(*) as userCount from users u 
                WHERE u.userId IN (${questionMarkString});
            `;
            
            const [rows] = await this.dbPool.execute(userCountQuery, userIds) as RowDataPacket[];
            
            return rows[0].userCount == userIds.length;
        } catch(err){
            this.close();
            throw err;
        }
    }


    /**
     * retrieve user data from email address
     * 
     * @param email : string
     * @returns Promise<User>
     */

    async getByUserEmail(email: string): Promise<User>  {

        try {
            let retrieveQuery = `
            SELECT * FROM users u
            WHERE u.email = ?
            `;

            const dbVars = [email];

            const [rows] = await this.dbPool.execute(retrieveQuery, dbVars) as RowDataPacket[];

            if (rows.length == 0){
                throw new SqlUserDataServiceNotFoundError({
                        query: retrieveQuery,
                        db: process.env.DB_DATABASE as string,
                        dbVars: dbVars
                });
            }
            else{
                const user: User = {
                    lastName: rows[0].lastName,
                    firstName: rows[0].firstName,
                    email: rows[0].email,
                    userId: rows[0].userId
                }
                return user; 
            }
        }catch(err){
            this.close();
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
            this.close();
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

        let dbVars = [userId]
        
        try {
            const deleteResult = await this.dbPool.execute(deleteQuery, dbVars) as ResultSetHeader[];
            
            if (deleteResult[0].affectedRows == 0 ) {
                throw new SqlUserDataServiceNotFoundError({
                        query: deleteQuery,
                        db: process.env.DB_DATABASE as string,
                        dbVars: dbVars
                });
            }

            return; 
        }catch(err){
            this.close();
            throw err; 
        }
    }
    
    /**
     * areValidCredentials
     * 
     * this function takes in identifier and password and
     * verifies that a user exists with the identifier and 
     * that the password is valid. 
     * 
     * @param params
     *   - string: userIdentifier in this case, email address
     *   - string: password 
     * @returns Promise<boolean> true if credentials are valid, false if not 
     */

    async areValidCredentials(params: {userIdentifier: string, password: string}): Promise<boolean> {
        
        const {userIdentifier, password} = params; 

        try {
            const userQuery:string = `
            SELECT * from users u 
            WHERE email = ? 
            `;

            let dbVars = [userIdentifier];

            const [rows, fields] = await this.dbPool.execute(userQuery, dbVars) as RowDataPacket[];
           
            if (rows.length == 0 || ! await argon2.verify(rows[0]['password'], password)) {
                return false;
            }

            return true;

        }catch(err){
            this.close(); 
            throw err; 
        }
    
    } 


}

export default SqlUserDataService; 
