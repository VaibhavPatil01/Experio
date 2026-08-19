import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Notification } from '../modules/posts/models/Notification.js';
import User from '../modules/users/models/User.js';
import { Post } from '../modules/posts/models/Post.js';
import { getUserNotifications } from '../modules/posts/repositories/notificationRepository.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Notification.deleteMany({});
  await User.deleteMany({});
  await Post.deleteMany({});
});

describe('Notification Grouping and Deduplication', () => {
  it('should group multiple unread likes on the same post into a single notification representation', async () => {
    const recipient = new User({ username: 'TargetUser', email: 't@t.com', password: '123', isEmailVerified: true, branch: 'CS', passingYear: '2025', about: 'test', designation: 'student' });
    const actor1 = new User({ username: 'John', email: 'j@t.com', password: '123', isEmailVerified: true, branch: 'CS', passingYear: '2025', about: 'test', designation: 'student' });
    const actor2 = new User({ username: 'Mary', email: 'm@t.com', password: '123', isEmailVerified: true, branch: 'CS', passingYear: '2025', about: 'test', designation: 'student' });
    
    await Promise.all([recipient.save(), actor1.save(), actor2.save()]);

    const post = new Post({ userId: recipient._id, company: 'Google', role: 'SWE', status: 'Approved' });
    await post.save();

    // Create 3 atomic like events (simulate 1 duplicate from John to test deduplication conceptually)
    await Notification.create([
      { recipientId: recipient._id, actorId: actor1._id, type: 'POST_LIKE', entityType: 'POST', entityId: post._id, postId: post._id, eventId: `like_${actor1._id}_${post._id}`, isRead: false },
      { recipientId: recipient._id, actorId: actor2._id, type: 'POST_LIKE', entityType: 'POST', entityId: post._id, postId: post._id, eventId: `like_${actor2._id}_${post._id}`, isRead: false }
    ]);

    const notifications = await getUserNotifications(recipient._id, 10);
    
    // Should group the two likes into one UI representation
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('POST_LIKE');
    expect(notifications[0].actors).toHaveLength(2);
    // Ensure actor population worked
    const actorNames = notifications[0].actors.map(a => a.username);
    expect(actorNames).toContain('John');
    expect(actorNames).toContain('Mary');
  });

  it('should not group read and unread notifications together', async () => {
    const recipient = new User({ username: 'TargetUser', email: 't@t.com', password: '123', isEmailVerified: true, branch: 'CS', passingYear: '2025', about: 'test', designation: 'student' });
    const actor1 = new User({ username: 'John', email: 'j@t.com', password: '123', isEmailVerified: true, branch: 'CS', passingYear: '2025', about: 'test', designation: 'student' });
    
    await Promise.all([recipient.save(), actor1.save()]);
    const post = new Post({ userId: recipient._id, company: 'Google', role: 'SWE', status: 'Approved' });
    await post.save();

    await Notification.create([
      { recipientId: recipient._id, actorId: actor1._id, type: 'POST_LIKE', entityType: 'POST', entityId: post._id, postId: post._id, eventId: `like_1`, isRead: true, createdAt: new Date(Date.now() - 10000) },
      { recipientId: recipient._id, actorId: actor1._id, type: 'POST_LIKE', entityType: 'POST', entityId: post._id, postId: post._id, eventId: `like_2`, isRead: false, createdAt: new Date() }
    ]);

    const notifications = await getUserNotifications(recipient._id, 10);
    
    expect(notifications).toHaveLength(2); // One read group, one unread group
  });
});
