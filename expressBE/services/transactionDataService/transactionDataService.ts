import Transaction from '../../types/transaction';
import ReceiptItem from '../../types/receiptItem';

//no update function. A TRANSACTION IS FOR LIFE.
//joking aside, update might be useful to implement just for internal use
interface TransactionDataService{
    create(params: {initiatorUserId:number, businessName:string, receiptItems: ReceiptItem[]}): Promise<number>; //return transactionId
    getByTransactionId(transactionId: number): Promise<Transaction>;
    getAllByUserId(userId: number): Promise<Transaction[]>;
    delete(userId: number): Promise<void>; //this should only be used during develpment
}

export default TransactionDataService;