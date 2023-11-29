import React from "react";

interface ReceiptItemType {
	itemName: string,
	price: number, 
	username: string	
};

interface GlobalDataType {
	curUsername: string, 
	userId: number, 
	isConnectedToSocketServer: boolean, 
	receiptArray: ReceiptItemType[],
};

interface GlobalDataContextType {
	globals: GlobalDataType,
	setGlobals: React.Dispatch<React.SetStateAction<GlobalDataType>>;
}

export type {
	ReceiptItemType,
	GlobalDataType,
	GlobalDataContextType
};

