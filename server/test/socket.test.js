import { jest } from '@jest/globals';
import { initSocket, emitNotificationToUser } from '../configs/socket.js';
import { Server } from 'socket.io';
import * as tokenUtils from '../utils/token/decodeToken.js';
import winston from 'winston';

jest.mock('socket.io');
jest.mock('@socket.io/redis-adapter', () => ({
  createAdapter: jest.fn()
}));
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    duplicate: jest.fn().mockReturnThis()
  }));
});
jest.mock('../utils/token/decodeToken.js', () => ({
  default: jest.fn()
}));

describe('WebSocket Config', () => {
  let mockIo;
  let useMiddleware;
  let connectionHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockIo = {
      use: jest.fn((mw) => { useMiddleware = mw; }),
      on: jest.fn((event, handler) => { 
        if (event === 'connection') connectionHandler = handler; 
      }),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    Server.mockImplementation(() => mockIo);

    initSocket({});
  });

  describe('Authentication Middleware', () => {
    it('should reject if no token is provided', () => {
      const socket = { handshake: { auth: {} }, headers: {} };
      const next = jest.fn();

      useMiddleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Authentication error: Token missing');
    });

    it('should reject if token is invalid', () => {
      const socket = { handshake: { auth: { token: 'invalid_token' } } };
      const next = jest.fn();
      tokenUtils.default.mockReturnValue(null);

      useMiddleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Authentication error: Invalid token');
    });

    it('should authenticate and assign userId', () => {
      const socket = { handshake: { headers: { token: 'valid_token' } } };
      const next = jest.fn();
      tokenUtils.default.mockReturnValue({ id: 'auth_user_1' });

      useMiddleware(socket, next);

      expect(socket.userId).toBe('auth_user_1');
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Connection & Emitting', () => {
    it('should join correct user room on connect', () => {
      const socket = { id: 'socket_1', userId: 'auth_user_1', join: jest.fn(), on: jest.fn() };
      connectionHandler(socket);

      expect(socket.join).toHaveBeenCalledWith('user:auth_user_1');
      expect(socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('should emit notification to correct room', () => {
      emitNotificationToUser('auth_user_1', { message: 'Hello' });

      expect(mockIo.to).toHaveBeenCalledWith('user:auth_user_1');
      expect(mockIo.emit).toHaveBeenCalledWith('notification:new', { message: 'Hello' });
    });
  });
});
