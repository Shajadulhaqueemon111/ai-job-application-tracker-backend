import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://ai-job-application-tracker-weld.vercel.app',
      ],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    /**
     * 👇 USER PERSONAL ROOM (notification, online status)
     */
    socket.on('register', (userId: string) => {
      if (userId) {
        socket.join(userId);
        console.log(`User joined personal room: ${userId}`);
      }
    });

    /**
     * 👇 CHAT ROOM (APPLICATION / CONVERSATION)
     */
    socket.on('joinRoom', (applicationId: string) => {
      if (applicationId) {
        socket.join(applicationId);
        console.log(`Joined chat room: ${applicationId}`);
      }
    });

    socket.on('leaveRoom', (applicationId: string) => {
      if (applicationId) {
        socket.leave(applicationId);
        console.log(`Left chat room: ${applicationId}`);
      }
    });

    /**
     * disconnect
     */
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};
