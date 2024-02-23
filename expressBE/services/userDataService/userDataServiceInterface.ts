import User from '../../types/user';

interface UserDataServiceInterface{
    //returns userId
    create(firstName: string, lastName: string, email:string, password: string): Promise<number>;
    getByUserId(userId: number): Promise<User>;
    update(userId:number, firstName?: string, lastName?: string, email?: string): Promise<User>;
    delete(userId: number): void;
}

export default UserDataServiceInterface;