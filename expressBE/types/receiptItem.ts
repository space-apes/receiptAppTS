interface ReceiptItem {
    userId: number, 
    username: string, 
    itemName: string, 
    itemPrice: number,
    transactionId?: number
}

export default ReceiptItem;
