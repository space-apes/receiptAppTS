import ReceiptSelectItem from './ReceiptSelectItem';
import {ReceiptItemType} from '../../types';

/*
    array of objects
    objects can not be removed or added 
    objects can be selected or not selected 
    selected objects will have a user associated
*/

const ReceiptSelectTable = ( props:{receiptSelectDataItems:Array<ReceiptItemType>} ) => {


    const {receiptSelectDataItems} = props;

    return (
        <div className="centered">
            <div className = "receiptSelectTableRow">
                <div className="receiptSelectTableCell">Item Name</div>
                <div className="receiptSelectTableCell">Item Price</div>
                <div className="receiptSelectTableCell">User </div>
            </div>

            { receiptSelectDataItems.map((item, index) => {
                return <ReceiptSelectItem key = {index} index = {index} receiptSelectDataItem={item} /> 
                })}

        </div>
    );
}

export default ReceiptSelectTable;