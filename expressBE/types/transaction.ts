import ReceiptItem from './receiptItem';

interface Transaction {
    transactionId?: number,
    initiatorUserId: number,
    businessName: string,
    receiptItems: ReceiptItem[]
    dateCreated?: string,
};

export default Transaction; 
