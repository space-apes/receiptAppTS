import RedisTransactionSessionService from './redisTransactionService';
import Transaction from '../../../types/transaction';
import dotenv from 'dotenv'; 

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
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	});

	describe('create method', ()=> {
		describe('given valid arguments', ()=>{
			it('should return true', async()=>{
				expect(service.create('testRoomName1', testTransaction1).toBe(true); 
			});
		})	
	});
});
