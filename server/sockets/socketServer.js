import { Server } from 'socket.io';

let io;
export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'], credentials: true }
  });
  io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => socket.join(room));
    socket.on('leaveRoom', (room) => socket.leave(room));
    socket.on('expenseCreated', (payload) => io.to(payload.room).emit('expenseCreated', payload));
    socket.on('notification', (payload) => io.to(payload.room).emit('notification', payload));
    socket.on('typing', (payload) => io.to(payload.room).emit('typing', payload));
    socket.on('disconnect', () => {});
  });
};

export const getSocket = () => io;
