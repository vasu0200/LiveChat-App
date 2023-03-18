const express = require("express");
const fs=require("fs");
const ejs = require("ejs");
const { Server } = require("socket.io");
const app = express();
const http = require('http');
const { Socket } = require("dgram");
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/style.css",(req,res)=>{
    const indCSS=fs.readFileSync("./views/style.css","utf-8");
    res.type(".css").send(indCSS);
});

let users = {}; 
io.on("connection", (socket) => {
    socket.on("userAdd", (userName) => {
        users[userName] = socket.id;
       
        io.emit("userAdded", users)
    })
    socket.on("sendMessage" , (data) => {
        const {sender,receiver,content} = data;
        const receiveriD = users[receiver];
        io.to(receiveriD).emit("messageReceived", data);
        
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})
console.log(users)

server.listen(3000, () => {
    console.log('listening on *:3000');
});