const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const chatRoutes = require('./src/routes/chat.routes');
const userRoutes = require('./src/routes/user.routes');

const Message = require('./src/models/Message');

const app = express();

const onlineUsers = new Map();

app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

io.on('connection', (socket) => {

    console.log('User Connected:', socket.id);

    // Register user for private messaging
    socket.on('registerUser', (userId) => {

        onlineUsers.set(userId, socket.id);

        console.log(
            `User ${userId} registered with socket ${socket.id}`
        );
    });

    // Room Chat
    socket.on('joinRoom', (roomId) => {

        socket.join(roomId);

        console.log(
            `User ${socket.id} joined room ${roomId}`
        );
    });

    socket.on('sendMessage', (data) => {

        io.to(data.roomId)
            .emit('receiveMessage', data);

    });

    // Private Chat
    socket.on('privateMessage', async (data) => {

    console.log("PRIVATE MESSAGE RECEIVED");
    console.log(data);

    try {

        const message = await Message.create({

            sender: data.sender,
            receiver: data.receiver,
            content: data.content

        });

        console.log("MESSAGE SAVED");
        console.log(message);

        const receiverSocketId =
            onlineUsers.get(data.receiver);

        console.log("Receiver Socket:", receiverSocketId);

        if (receiverSocketId) {

            io.to(receiverSocketId)
              .emit(
                'receivePrivateMessage',
                message
              );

            console.log("Sent to receiver");

        }

        socket.emit(
            'receivePrivateMessage',
            message
        );

        console.log("Sent to sender");

    } catch (err) {

        console.error("PRIVATE MESSAGE ERROR");
        console.error(err);

    }

});

    socket.on('disconnect', () => {

        for (const [userId, socketId] of onlineUsers.entries()) {

            if (socketId === socket.id) {

                onlineUsers.delete(userId);
                break;

            }

        }

        console.log(
            'User disconnected:',
            socket.id
        );

    });

});

const PORT = 5000;

const start = async () => {

    try {

        await connectDB();

        server.listen(PORT, () => {

            console.log(
                `Server running on port ${PORT}`
            );

        });

    } catch (err) {

        console.error(
            'Failed to start server',
            err
        );

    }

};

start();