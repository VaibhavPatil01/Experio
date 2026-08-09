import { Server } from 'socket.io';
import decodeToken from '../utils/token/decodeToken.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Or specify exact frontend domain for prod
      methods: ["GET", "POST"]
    },
    pingInterval: 25000,
    pingTimeout: 20000
  });

  // Authentication Middleware
  io.use((socket, next) => {
    try {
      // Clients can send token via auth object
      const token = socket.handshake.auth?.token || socket.handshake.headers['token'];
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = decodeToken(token);
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Associate socket with user ID
      socket.userId = decoded.id;
      next();
    } catch (error) {
      logger.warn('[Socket.io] Authentication failed', { error: error.message });
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const userRoom = `user:${userId}`;

    logger.info(`[Socket.io] Client connected`, { socketId: socket.id, userId });

    // Join user-specific channel to receive private notifications
    socket.join(userRoom);

    // Initial sync could happen here, or client can explicitly fetch.
    // For now, we wait for the client to ask for sync or just let HTTP handle it.
    
    socket.on('disconnect', (reason) => {
      logger.info(`[Socket.io] Client disconnected`, { socketId: socket.id, userId, reason });
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

/**
 * Deliver a real-time notification to a specific user across all their connected devices.
 */
export const emitNotificationToUser = (userId, notificationObj) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notificationObj);
  }
};
