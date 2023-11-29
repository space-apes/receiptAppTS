import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { useState, useEffect} from "react"; 
import GlobalContext from './context/GlobalContext';
import {GlobalDataType} from './types';
import Navbar  from './components/Navbar';
import HomePage from './pages/HomePage';
import ReceiptSelectPage from './pages/ReceiptSelectPage'; 
import socket from './socket'; 
/*
to update context combine it with state: 
- declare state variable in parent component 
- pass current state down as context value to provider 

*/

function App() {

	const initializedGlobals:GlobalDataType = {
		curUsername: "",
		userId: 0,
		receiptArray: [],
		isConnectedToSocketServer: false 
	};

	//const [globals, setGlobals] = useState ({curUsername: "", userId: 0, receiptArray: [], isConnectedToSocketServer: socket.connected});
	const [globals, setGlobals] = useState (initializedGlobals);

	useEffect(()=>{
		function onConnect() {
			setGlobals({...globals, isConnectedToSocketServer: true});
		}

		function onDisconnect() {
			setGlobals({...globals, isConnectedToSocketServer: false});
		}

		function onReceiptArray(receiptArrayFromSocket:[]) {
			console.log(`receipt received`);
			console.log(globals);
			setGlobals({...globals, receiptArray: receiptArrayFromSocket})
			console.log(globals);
		}	


		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('receiptArray', onReceiptArray);
	}, [globals, setGlobals]);

  return (
    <div className="App">

		<GlobalContext.Provider value = { {globals, setGlobals} }>
			<BrowserRouter> 
				<Navbar />
				<div className="pages">
					<Routes>
						<Route 
						path="/"
						element = {<HomePage />}
						>
						</Route> 

						<Route 
						path ="/receiptSelect"
						element = { <ReceiptSelectPage /> } 
						>
						</Route> 
					</Routes>
				</div>
			</BrowserRouter>
		</GlobalContext.Provider>
    </div>
  );
}

export default App;
