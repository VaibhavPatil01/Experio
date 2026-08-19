import request from 'supertest';
import express from 'express';
import notificationRouter from '../routes/notificationRoutes.js';
import * as notificationRepo from '../repositories/notificationRepository.js';

jest.mock('../repositories/notificationRepository.js');
jest.mock('../middlewares/isUserAuth.js', () => (req, res, next) => {
  req.body = { authTokenData: { id: 'test_user_id' } };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRouter);

describe('Notification API E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/notifications should return paginated list', async () => {
    notificationRepo.getUserNotifications.mockResolvedValueOnce([
      { _id: 'notif_1', type: 'POST_LIKE' }
    ]);

    const res = await request(app).get('/api/notifications?limit=10');
    expect(res.status).toBe(200);
    expect(res.body.notifications).toHaveLength(1);
    expect(notificationRepo.getUserNotifications).toHaveBeenCalledWith('test_user_id', 10, undefined, false);
  });

  it('GET /api/notifications/unread-count should return count', async () => {
    notificationRepo.getUnreadNotificationCount.mockResolvedValueOnce(5);

    const res = await request(app).get('/api/notifications/unread-count');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(5);
  });

  it('PATCH /api/notifications/:id/read should mark single read', async () => {
    notificationRepo.markNotificationAsRead.mockResolvedValueOnce({ _id: 'notif_1' });

    const res = await request(app).patch('/api/notifications/notif_1/read');
    expect(res.status).toBe(200);
    expect(notificationRepo.markNotificationAsRead).toHaveBeenCalledWith('notif_1', 'test_user_id');
  });

  it('PATCH /api/notifications/read-all should mark all read', async () => {
    notificationRepo.markAllNotificationsAsRead.mockResolvedValueOnce({ modifiedCount: 3 });

    const res = await request(app).patch('/api/notifications/read-all');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
  });
});
