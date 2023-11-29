import ReceiptSelectTable from '../components/ReceiptSelectTable/ReceiptSelectTable';
//import testItems1 from '../testData/testItems1'; 
import {useContext} from 'react'; 
import GlobalContext from '../context/GlobalContext';

const ReceiptSelectPage = () => {

	
	const {globals} = useContext(GlobalContext); 
	const {receiptArray} = globals;

	return (
		<div className="receiptSelectPageDiv"> 
			<h1> welcome to receipt select  </h1> 
			<ReceiptSelectTable receiptSelectDataItems={receiptArray}/>  

			{ /* <ReceiptSelectTable receiptSelectDataItems={testItems1}/> */}
		</div> 
	);
}

export default ReceiptSelectPage;
