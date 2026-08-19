import { jest } from '@jest/globals';
import { 
  createNotification, 
  createNotificationsBatch, 
  getUserNotifications, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markMultipleNotificationsAsRead, 
  markAllNotificationsAsRead 
} from '../modules/posts/repositories/notificationRepository.js';
import { Notification } from '../modules/posts/models/Notification.js';

jest.mock('../modules/posts/models/Notification.js', () => ({
  Notification: {
    create: jest.fn(),
    findOne: jest.fn(),
    insertMany: jest.fn(),
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateMany: jest.fn()
  }
}));

describe('Notification Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification normally', async () => {
      const mockDoc = { _id: '1', eventId: 'evt_1' };
      Notification.create.mockResolvedValueOnce(mockDoc);
      
      const result = await createNotification({ eventId: 'evt_1', type: 'POST_LIKE' });
      expect(result).toEqual(mockDoc);
      expect(Notification.create).toHaveBeenCalledWith(expect.objectContaining({ eventId: 'evt_1' }));
    });

    it('should handle duplicate key (11000) idemptotency gracefully', async () => {
      const error = new Error('Duplicate');
      error.code = 11000;
      error.keyPattern = { eventId: 1 };
      
      Notification.create.mockRejectedValueOnce(error);
      const mockExistingDoc = { _id: '1', eventId: 'evt_1' };
      Notification.findOne.mockResolvedValueOnce(mockExistingDoc);
      
      const result = await createNotification({ eventId: 'evt_1' });
      expect(result).toEqual(mockExistingDoc);
      expect(Notification.findOne).toHaveBeenCalledWith({ eventId: 'evt_1' });
    });
  });

  describe('createNotificationsBatch', () => {
    it('should insert notifications with ordered: false', async () => {
      const mockDocs = [{ _id: '1' }, { _id: '2' }];
      Notification.insertMany.mockResolvedValueOnce(mockDocs);
      
      const result = await createNotificationsBatch([{ eventId: 'evt_1' }, { eventId: 'evt_2' }]);
      expect(result).toEqual(mockDocs);
      expect(Notification.insertMany).toHaveBeenCalledWith(
        expect.any(Array),
        { ordered: false }
      );
    });

    it('should extract insertedDocs on partial duplicate failure (11000)', async () => {
      const error = new Error('Duplicate chunk');
      error.code = 11000;
      error.insertedDocs = [{ _id: '2' }];
      Notification.insertMany.mockRejectedValueOnce(error);
      
      const result = await createNotificationsBatch([{ eventId: 'evt_1' }, { eventId: 'evt_2' }]);
      expect(result).toEqual([{ _id: '2' }]);
    });
  });

  describe('getUserNotifications', () => {
    it('should query unread notifications efficiently with aggregation', async () => {
      Notification.aggregate.mockResolvedValueOnce([{ _id: 'grouped' }]);
      
      await getUserNotifications('user_1', 10, null, true);
      
      expect(Notification.aggregate).toHaveBeenCalled();
      const pipeline = Notification.aggregate.mock.calls[0][0];
      
      // Should match recipientId and isRead: false
      const matchStage = pipeline.find(stage => stage.$match);
      expect(matchStage.$match.recipientId).toBe('user_1');
      expect(matchStage.$match.isRead).toBe(false);
    });
  });

  describe('getUnreadNotificationCount', () => {
    it('should count documents properly', async () => {
      Notification.countDocuments.mockResolvedValueOnce(5);
      
      const count = await getUnreadNotificationCount('user_1');
      expect(count).toBe(5);
      expect(Notification.countDocuments).toHaveBeenCalledWith({ recipientId: 'user_1', isRead: false });
    });
  });

  describe('Read operations', () => {
    it('should mark single notification as read', async () => {
      Notification.findOneAndUpdate.mockResolvedValueOnce({ _id: 'notif_1' });
      
      await markNotificationAsRead('notif_1', 'user_1');
      expect(Notification.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'notif_1', recipientId: 'user_1' },
        { $set: { isRead: true, readAt: expect.any(Date) } },
        { new: true }
      );
    });

    it('should mark all notifications as read', async () => {
      Notification.updateMany.mockResolvedValueOnce({ modifiedCount: 3 });
      
      await markAllNotificationsAsRead('user_1');
      expect(Notification.updateMany).toHaveBeenCalledWith(
        { recipientId: 'user_1', isRead: false },
        { $set: { isRead: true, readAt: expect.any(Date) } }
      );
    });
  });
});
