import User from '../../types/user';

interface UserDataService{
    //returns userId
    create(firstName: string, lastName: string, email:string, password: string): Promise<number>;
    getByUserId(userId: number): Promise<User>;
    getByUserEmail(email: string): Promise<User>;
    update(userId:number, firstName?: string, lastName?: string, email?: string): Promise<User>;
    delete(userId: number): void;
    usersExistById?(userIds: number[]): Promise<Boolean>
    areValidCredentials(params: {userIdentifier: string, password: string}): Promise<boolean> 
    close?(): void; 
}

export default UserDataService;