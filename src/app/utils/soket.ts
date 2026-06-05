import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      socket.join(userId as string);
    }

    console.log('Socket connected:', socket.id);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket not initialized');
  }
  return io;
};
