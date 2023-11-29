import {useNavigate} from 'react-router-dom';
import React, {useContext} from 'react';
import GlobalContext from '../context/GlobalContext';

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
				<form onSubmit={handleSubmit}> 

					<p> please enter your username </p>
					<label>
						<input type="text" name="usernameInput"/> 
					</label>

					<button> submit </button>
				</form>
			</div>
		</div> 
	);
}



export default HomePage;