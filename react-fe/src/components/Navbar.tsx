import { Link } from 'react-router-dom'; 
import GlobalContext from '../context/GlobalContext';
import { useContext } from "react"; 

const Navbar = () => {

	const {globals} = useContext(GlobalContext); 

	const {displayedName, isConnectedToSocketServer} = globals;

	return (
		<header> 
			<div className="container"> 
				<h1> Welcome to ReceiptApp, {displayedName ? displayedName : 'Anonymous'} ! </h1>
				<p> connected to socket server: {isConnectedToSocketServer ? 'true': 'false'} </p>
				<Link to="/">
					<p> home </p>
				</Link>
			</div>
		</header>
	)
}

export default Navbar;