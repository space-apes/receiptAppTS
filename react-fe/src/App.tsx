import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { useState, useEffect} from "react"; 
import GlobalContext from './context/GlobalContext';
import {GlobalDataType} from './types';
import Navbar  from './components/Navbar';
import HomePage from './pages/HomePage';
import ReceiptSelectPage from './pages/ReceiptSelectPage'; 
import ReceiptScanPage from './pages/ReceiptScanPage';
import socket from './socket'; 
/*
to update context combine it with state: 
- declare state variable in parent component 
- pass current state down as context value to provider 

*/

function App() {

	const initializedGlobals:GlobalDataType = {
		//curUsername: "",
		//userId: 0,
		displayedName: "",
		roomName: "",
		isInitiator: false,
		receiptArray: [],
		isConnectedToSocketServer: false,
	};

	const [globals, setGlobals] = useState (initializedGlobals);

	useEffect(()=>{
		function onConnect() {
			setGlobals((prev) => {return {...prev, isConnectedToSocketServer: true}});
		}

		function onDisconnect() {
			setGlobals((prev) => {return {...prev, isConnectedToSocketServer: false}});
		}

		function onReceiptArray(receiptArrayFromSocket:[]) {
			setGlobals((prev) => {return {...prev, receiptArray: receiptArrayFromSocket}});
		}	


		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('receiptArray', onReceiptArray);

		return ()=>{
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('receiptArray', onReceiptArray);

		};
	}, []);

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
						path ="/receiptScan"
						element = { <ReceiptScanPage /> } 
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
