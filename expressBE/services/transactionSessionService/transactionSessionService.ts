interface TransactionSessionService{
	create(params: {roomName: string, transaction:Transaction}): Promise<boolean>; 
	//getByRoomName(params: {roomName: string}): Promise<Transaction>;
	//updateReceiptItem(params: {roomName: string, itemIndex: number, displayedName: string, userId: number}): Transaction; 
}

export default TransactionSessionService;
