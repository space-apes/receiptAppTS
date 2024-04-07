import socket from '../../socket'; 
import {useContext} from 'react';
import {ReceiptItemType} from '../../types';

import GlobalContext from '../../context/GlobalContext';

//const ReceiptSelectItem = ( {receiptSelectDataItem, index} ) => {
const ReceiptSelectItem = ( props:{receiptSelectDataItem:ReceiptItemType, index:number} ) => {

    const {receiptSelectDataItem, index} = props;

    const {globals} = useContext (GlobalContext); 

    //const {curUsername} = globals;
    const {displayedName} = globals; 
    const {itemName, price, username} = receiptSelectDataItem;

    const handleOnClick = () => {
        console.log(`emitting update user event with index: ${index}, newUsername: ${displayedName}`)
        socket.emit('updateItemUser', {index: index, newUsername: displayedName})
    }

    return (
        <div className="receiptSelectTableRow" onClick={handleOnClick}>
            <div className="receiptSelectTableCell">{itemName}</div>
            <div className="receiptSelectTableCell">{price}</div>
            <div className="receiptSelectTableCell">{username}</div>

        </div>

    );    
}


export default ReceiptSelectItem;
