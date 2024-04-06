import {useNavigate} from 'react-router-dom';
import React, {useContext} from 'react';
import GlobalContext from '../context/GlobalContext';
import InitiatorSessionForm from '../components/InitiatorSessionForm/InitiatorSessionForm';

const HomePage = () => {

	const {globals, setGlobals} = useContext(GlobalContext); 

	const navigate = useNavigate(); 

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

		//prevent reload 
		e.preventDefault();

		//retrieve form data
		//target is where event was triggered
		//currentTarget is where handler is attached 

		//update user context 
		setGlobals({...globals, curUsername: e.currentTarget.usernameInput.value});

		//navigate to react route 
		navigate('/receiptSelect');
		
	}

	return (
		<div className="homePageDiv"> 
			<h1> Home Screen </h1> 
			<div className="centered">
				<h4>
					Enter your roomName and displayedName to start a guest transaction.
					<br/><br/>
					Optionally, enter email/password to login and remember this transaction.
				</h4>
				<InitiatorSessionForm/>
			</div>
		</div> 
	);
}



export default HomePage;