import RedisTransactionSessionService from '../redisTransactionSessionService';
import Transaction from '../../../types/transaction';
import dotenv from 'dotenv';

dotenv.config({path: '../../../.env'});

const testTransaction1: Transaction  = {
	initiatorUserId: -1,
	businessName: 'testTransaction',
	receiptItems: [
		{
			userId: -1,
			username: 'redisTestUser1',
			itemName: 'stringCheese',
			itemPrice: 7.99
		},
		{
			userId: -1,
			username: 'redisTestUser2',
			itemName: 'burgerPizza',
			itemPrice: 3.45
		}
	]
		
}


describe('RedisTransactionSessionService', ()=>{
	const service: RedisTransactionSessionService = new RedisTransactionSessionService({
		username: process.env.REDIS_USER || '',
		password: process.env.REDIS_PASSWORD || '',
		host:process.env.REDIS_HOST as string ,
		port: parseInt(process.env.REDIS_PORT as string)
	});
	describe('create method', ()=> {
		describe('given valid arguments', ()=>{
			it('should return true', async()=>{
				expect(await service.create({roomName: 'testRoomName1', transaction: testTransaction1})).toBe(true); 
				
			});
		})	
	});
});
