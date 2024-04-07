import React from "react";

interface ReceiptItemType {
	itemName: string,
	price: number, 
	username: string	
};

interface GlobalDataType {
	//urUsername: string, 
	//userId: number, 
	isInitiator: boolean,
	displayedName: string,
	roomName: string,
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

