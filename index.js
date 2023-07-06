require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/error');
const bookApiRouter = require('./routes/api/book');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.json())
app.set("view engine", "ejs");

app.use('/api', bookApiRouter);

app.use(errorMiddleware);

io.on('connection', (socket) => {
    const {id} = socket;
    console.log(`Socket connected: ${id}`);
    
    const {roomName} = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});


async function start(PORT, UrlDB) {
    try {
        await mongoose.connect(UrlDB);
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

const UrlDB = process.env.UrlDB
const PORT = process.env.PORT || 3000;
start(PORT, UrlDB);
