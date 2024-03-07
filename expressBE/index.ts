import express, {Express, Request, Response} from 'express';
import http from 'http'; 
import {Server} from 'socket.io'; 
import dotenv from 'dotenv';
import {attachMiddleware} from './middleware';

//services selected based on environment variables 
//from ./sqlSelector.ts

dotenv.config(); 

let app:Express = express(); 
app = attachMiddleware(app);

//temporary socket.io test data
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

