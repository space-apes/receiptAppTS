import {useNavigate} from 'react-router-dom';
import React, {useContext} from 'react';
import GlobalContext from '../context/GlobalContext';
import InitiatorSessionForm from '../components/InitiatorSessionForm/InitiatorSessionForm';

const ReceiptScanPage = () => {

	const {globals, setGlobals} = useContext(GlobalContext);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

		//prevent reload 
		e.preventDefault();

		//navigate to react route 
		
	}

	return (
		<div className="receiptScanDiv"> 
			<h1> Receipt Scan </h1> 
			<div className="centered">
				SCAN YOUR RECEIPT HERE!
			</div>
		</div> 
	);
}



export default ReceiptScanPage;