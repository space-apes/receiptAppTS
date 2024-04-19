import  Transaction  from '../../types/transaction';
import TransactionSessionService from './transactionSessionService';
import { createClient, RedisClientType} from 'redis';



class RedisTransactionSessionService implements TransactionSessionService{

	private client: RedisClientType;

	constructor(params: {username?: string, password?: string, host: string, port: number}){

		const {username, password, host, port} = params; 

		let url: string; 
		
		if (username && password){
			url = `redis://${username}:${password}@${host}:${port}`;
		}
		else{
			url= `redis://${host}:${port}`;
		}
		
		this.client = createClient({
			url: url
		});
	}

	async create(params: {roomName: string, transaction: Transaction}): Promise<boolean> {
		
		const roomName: string = params.roomName; 
		const transaction:Transaction = params.transaction; 
		const {businessName, initiatorUserId} = transaction;
	
		try{
	
		await this.client.hSet(roomName, 'businessName', transaction.businessName);	
		await this.client.hSet(roomName, 'initiatorUserId', transaction.initiatorUserId);
		const receiptItemJsonString: string = JSON.stringify(transaction.receiptItems);
		await this.client.hSet(roomName, 'receiptItems', receiptItemJsonString);
		}catch(err){
			console.log(err); 
		}
		
		return true; 
	}

	/*	
	async getByRoomName(params: {roomName: string}): Transaction {
			
			
	}
	*/
		
}

export default RedisTransactionSessionService;
