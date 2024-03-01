import ReceiptItem from './receiptItem';
import User from './user';

interface Transaction {
    transactionId: number,
    initiatorUserId: number,
    businessName: string,
    receiptItems: ReceiptItem[]
    dateCreated: string,
};

export default Transaction; 