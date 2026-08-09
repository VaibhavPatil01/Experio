import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAppSelector } from '../redux/store';
import { BASE_API_URL } from '../services/serverConfig';
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../services/notificationServices';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Redux user state tells us if logged in
  const user = useAppSelector((state) => state.userState.user);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!user && !!token;

  // Initialize socket when user logs in
  useEffect(() => {
    if (!isLoggedIn) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(BASE_API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    setSocket(newSocket);

    // Fetch initial data
    loadInitialNotifications();
    loadUnreadCount();

    newSocket.on('connect', () => {
      console.log('[NotificationSocket] Connected');
      // On reconnect, sync unread count to avoid mismatch, 
      // but only if it's a reconnection (not initial which we just did above).
      // A simple loadUnreadCount() is safe.
      loadUnreadCount();
    });

    newSocket.on('notification:new', (newNotification) => {
      setNotifications((prev) => {
        // Deduplicate using eventId (or _id)
        const exists = prev.some(n => n.eventId === newNotification.eventId);
        if (exists) return prev;
        return [{ ...newNotification, _isNew: true }, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on('notification:read', ({ notificationId }) => {
      setNotifications((prev) => {
        let wasUnread = false;
        const updated = prev.map(n => {
          if (n._id === notificationId || n.notificationIds?.includes(notificationId)) {
            if (!n.isRead) wasUnread = true;
            return { ...n, isRead: true };
          }
          return n;
        });
        
        if (wasUnread) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return updated;
      });
    });

    newSocket.on('notification:read_all', () => {
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });

    newSocket.on('disconnect', () => {
      console.log('[NotificationSocket] Disconnected');
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [isLoggedIn, token]);

  const loadInitialNotifications = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const res = await fetchNotifications(20, null);
      setNotifications(res.data.notifications);
      if (res.data.notifications.length > 0) {
        setCursor(res.data.notifications[res.data.notifications.length - 1].createdAt);
      }
      setHasMore(res.data.notifications.length === 20);
    } catch (err) {
      console.error('Failed to load initial notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const loadMoreNotifications = async () => {
    if (!hasMore || isFetching) return;
    try {
      setIsFetching(true);
      const res = await fetchNotifications(20, cursor);
      setNotifications((prev) => {
        const newItems = res.data.notifications.filter(
          n => !prev.some(p => p._id === n._id || p.eventId === n.eventId)
        );
        return [...prev, ...newItems];
      });
      if (res.data.notifications.length > 0) {
        setCursor(res.data.notifications[res.data.notifications.length - 1].createdAt);
      }
      setHasMore(res.data.notifications.length === 20);
    } catch (err) {
      console.error('Failed to load more notifications:', err);
      setError('Failed to load more notifications. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await fetchUnreadCount();
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    // Only proceed if it is actually unread in our local state to prevent loop/spam
    const notif = notifications.find(n => n._id === id);
    if (notif && notif.isRead) return;

    // Optimistic update
    setNotifications((prev) => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    
    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      socket,
      notifications,
      unreadCount,
      isFetching,
      error,
      hasMore,
      loadMoreNotifications,
      loadInitialNotifications,
      markAsRead,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
