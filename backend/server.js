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
const User = require('./src/models/User');

const app = express();
const onlineUsers = new Map();

app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

app.set("io", io);

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

    // ==========================
    // REGISTER USER
    // ==========================
    socket.on('registerUser', async (userId) => {

        try {

            onlineUsers.set(userId, socket.id);

            await User.findByIdAndUpdate(
                userId,
                {
                    status: 'online'
                }
            );

            io.emit(
                'userStatusChanged',
                {
                    userId,
                    status: 'online'
                }
            );

            console.log(
                `User ${userId} is ONLINE`
            );

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================
    // ROOM CHAT
    // ==========================
    socket.on('joinRoom', (roomId) => {

        socket.join(roomId);

        console.log(
            `User ${socket.id} joined room ${roomId}`
        );

    });

    socket.on('sendMessage', (data) => {

        io.to(data.roomId)
            .emit(
                'receiveMessage',
                data
            );

    });

    // ==========================
    // PRIVATE CHAT
    // ==========================
    socket.on('privateMessage', async (data) => {

        console.log(
            'PRIVATE MESSAGE RECEIVED'
        );

        console.log(data);

        try {

            const message =
                await Message.create({

                    sender: data.sender,
                    receiver: data.receiver,
                    content: data.content

                });

            console.log(
                'MESSAGE SAVED'
            );

            const receiverSocketId =
                onlineUsers.get(
                    data.receiver
                );

            // Send to receiver
            if (receiverSocketId) {

                io.to(receiverSocketId)
                    .emit(
                        'receivePrivateMessage',
                        message
                    );

                console.log(
                    'Sent to receiver'
                );

            }

            // Send back to sender
            socket.emit(
                'receivePrivateMessage',
                message
            );

            console.log(
                'Sent to sender'
            );

        } catch (err) {

            console.error(
                'PRIVATE MESSAGE ERROR'
            );

            console.error(err);

        }

    });

    // ==========================
    // DISCONNECT
    // ==========================
    socket.on('disconnect', async () => {

        let disconnectedUserId = null;

        for (const [userId, socketId] of onlineUsers.entries()) {

            if (socketId === socket.id) {

                disconnectedUserId = userId;

                onlineUsers.delete(userId);

                break;

            }

        }

        if (disconnectedUserId) {

            try {

                await User.findByIdAndUpdate(
                    disconnectedUserId,
                    {
                        status: 'offline'
                    }
                );

                io.emit(
                    'userStatusChanged',
                    {
                        userId: disconnectedUserId,
                        status: 'offline'
                    }
                );

                console.log(
                    `User ${disconnectedUserId} is OFFLINE`
                );

            } catch (err) {

                console.error(err);

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