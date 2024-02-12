import express, {Express, Request, Response, Router} from 'express';
import http from 'http'; 
import {Server} from 'socket.io'; 
import cors from 'cors'; 
import dotenv from 'dotenv';
import {openAPIDocJSON} from './library/openAPIDoc';
import swaggerUi from 'swagger-ui-express';
import {displayRequestsMiddleware} from './middleware';
import {userRouter} from './routes';

console.log(openAPIDocJSON);

dotenv.config(); 

// create express app
const app:Express = express(); 


//main app middleware
app.use([
    cors({origin: "*"}),
    displayRequestsMiddleware,
    express.json(),
]);

//basic test route 
app.get('/', (req:Request, res:Response) => {
	res.json({'msg:': 'the rootest path. express + typescript server! woohoo!'}); 
});

//users routes
app.use('/api/users', [express.json(), userRouter]); 

//openAPI documentation routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocJSON));



//socket server
let receiptArray = [
    {
        itemName: "nachos",
        price: 12.99,
        username: "",
    },
    {
        itemName: "kale salad",
        price: 11.75,
        username: "",
    },
    {
        itemName: "beer",
        price: 7.00,
        username: "",
    },
    {
        itemName: "beer",
        price: 7.00,
        username: "",
    },
    {
        itemName: "carrot cake slice",
        price: 6.00,
        username: "",
    }
];

//create http server
const server = http.createServer(app); 


//create socket.io server
// TODO: add cors to whitelist only local 
const io = new Server(server, {
	cors: {origin: "*"}
}); 

// add socket handlers for BE 
io.on('connection', (socket) => {
	console.log('a user connected'); 
	io.emit('receiptArray', receiptArray); 
	
	socket.on('updateItemUser', (indexNewUsername) =>{
		const {index, newUsername} = indexNewUsername;
		console.log(`receipted updateItemUser event: index: ${index}, newUsername: ${newUsername}`);
		
		receiptArray[index]['username'] = newUsername; 
		io.emit('receiptArray', receiptArray); 
	});
});

//start the http server 
server.listen(process.env.EXPRESS_PORT as string, ()=>{
	console.log(`express running on ts-node listening on port: ${process.env.EXPRESS_PORT}`);
}); 

