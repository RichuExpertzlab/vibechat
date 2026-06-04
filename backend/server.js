const express=require('express');
const http=require('http');
const{Server}=require('socket.io');

const cors=require('cors');
const connectDB=require('./src/config/db');
const authRoutes=require('./src/routes/auth.routes');
const chatRoutes=require('./src/routes/chat.routes');

const app=express();


const cookieParser=require('cookie-parser');
app.use(cookieParser());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        credentials:true
    }
});
app.use(cors({origin:'http://localhost:5173',credentials:true}));
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);

io.on('connection',(socket)=>{
    console.log('a user connected',socket.id);
    socket.on('joinRoom',(roomId)=>{
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    socket.on('sendMessage',(data)=>{
        io.to(data.roomId).emit('receiveMessage',data);
    });
    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
    }); 
});

const PORT=5000;
const start=async()=>{
    try{
        await connectDB();
        server.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        });
    }catch(err){
        console.error('Failed to start server',err);
    }   
};
start();