import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Notification } from '../../types';
import {
  Bell,
  CheckCheck,
  X,
  Clock,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  /**
   * Sends the current unread count back to Navbar.
   * This keeps the notification badge synchronized
   * without requiring a page refresh.
   */
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationDrawer: React.FC<
  NotificationDrawerProps
> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<
    number | 'all' | null
  >(null);

  const navigate = useNavigate();

  /**
   * Calculate unread notifications from the current
   * drawer state.
   */
  const updateUnreadCount = (
    notificationList: Notification[]
  ) => {
    const unreadCount = notificationList.filter(
      (notification) => !notification.isRead
    ).length;

    onUnreadCountChange?.(unreadCount);
  };

  /**
   * Fetch the latest notifications whenever the drawer opens.
   */
  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const response = await api.get('/notifications');

      const notificationData: Notification[] =
        Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setNotifications(notificationData);

      updateUnreadCount(notificationData);
    } catch (error) {
      console.error(
        'Failed to fetch notifications:',
        error
      );

      toast.error(
        'Unable to load notifications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  /**
   * Mark one notification as read.
   */
  const handleMarkAsRead = async (id: number) => {
    if (actionLoading !== null) {
      return;
    }

    const notification = notifications.find(
      (item) => item.notificationId === id
    );

    /*
     * If it is already read, there is nothing to do.
     */
    if (!notification || notification.isRead) {
      return;
    }

    setActionLoading(id);

    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((previousNotifications) => {
        const updatedNotifications =
          previousNotifications.map((item) =>
            item.notificationId === id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          );

        /*
         * Immediately synchronize Navbar badge.
         */
        updateUnreadCount(updatedNotifications);

        return updatedNotifications;
      });
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );

      toast.error(
        'Unable to mark notification as read.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Mark every notification as read.
   */
  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead
    );

    /*
     * Avoid unnecessary API calls when everything
     * is already read.
     */
    if (unreadNotifications.length === 0) {
      onUnreadCountChange?.(0);
      return;
    }

    if (actionLoading !== null) {
      return;
    }

    setActionLoading('all');

    try {
      await api.patch('/notifications/read-all');

      const updatedNotifications =
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));

      setNotifications(updatedNotifications);

      /*
       * Immediately remove Navbar red badge.
       */
      onUnreadCountChange?.(0);

      toast.success(
        'All notifications marked as read'
      );
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );

      toast.error(
        'Unable to mark all notifications as read.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle clicking an individual notification.
   *
   * The notification is marked as read first.
   * Then the user is redirected to the relevant page.
   */
  const handleNotificationClick = async (
    notification: Notification
  ) => {
    if (actionLoading !== null) {
      return;
    }

    if (!notification.isRead) {
      await handleMarkAsRead(
        notification.notificationId
      );
    }

    onClose();

    if (
      notification.notificationType ===
      'ITEM_PENDING_VERIFICATION'
    ) {
      navigate('/approvals');
      return;
    }

    if (notification.claimId) {
      navigate('/claims');
      return;
    }

    if (notification.itemId) {
      navigate(
        `/items/${notification.itemId}`
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        overflow-hidden
        bg-slate-950/60
        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="
          absolute
          inset-0
          h-full
          w-full
          cursor-default
          bg-transparent
        "
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-full pl-0 sm:pl-10">
        <div
          className="
            glass-panel
            relative
            flex
            h-full
            w-full
            flex-col
            border-l
            border-slate-800
            shadow-2xl
            sm:max-w-md
          "
        >
          {/* Header */}
          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-3
              border-b
              border-slate-800/80
              p-4
              sm:p-5
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
                <Bell className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-100 sm:text-lg">
                  Notifications
                </h2>

                {!loading && (
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {notifications.filter(
                      (notification) =>
                        !notification.isRead
                    ).length}{' '}
                    unread
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {/* Mark all read */}
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={
                  actionLoading !== null ||
                  notifications.every(
                    (notification) =>
                      notification.isRead
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  text-indigo-400
                  transition
                  hover:bg-indigo-500/10
                  hover:text-indigo-300
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {actionLoading === 'all' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}

                <span className="hidden sm:inline">
                  Mark all read
                </span>
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close notifications"
                className="
                  inline-flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-800
                  hover:text-white
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
            {loading ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />

                <p className="text-sm text-slate-400">
                  Loading alerts...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center text-slate-400">
                <Bell className="mb-3 h-10 w-10 text-slate-600 opacity-50" />

                <p className="text-sm font-medium text-slate-300">
                  No notifications yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  You're all caught up.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const isActionLoading =
                    actionLoading ===
                    notification.notificationId;

                  return (
                    <button
                      key={
                        notification.notificationId
                      }
                      type="button"
                      disabled={actionLoading !== null}
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className={`
                        block
                        w-full
                        rounded-xl
                        border
                        p-4
                        text-left
                        transition
                        disabled:cursor-wait
                        ${
                          notification.isRead
                            ? 'border-slate-800/60 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:bg-slate-900/70'
                            : 'border-indigo-500/30 bg-indigo-950/20 text-slate-100 shadow-lg shadow-indigo-950/20 hover:border-indigo-400/50 hover:bg-indigo-950/30'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {notification.notificationType.includes(
                            'CLAIM'
                          ) ? (
                            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 text-indigo-400" />
                          )}

                          <h4 className="min-w-0 truncate text-sm font-semibold">
                            {notification.title}
                          </h4>
                        </div>

                        {isActionLoading ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-indigo-400" />
                        ) : (
                          !notification.isRead && (
                            <span
                              className="
                                mt-1
                                h-2
                                w-2
                                shrink-0
                                rounded-full
                                bg-indigo-500
                              "
                            />
                          )
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3 shrink-0" />

                        <span>
                          {new Date(
                            notification.createdAt
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {notification.isRead && (
                          <span className="ml-1 text-emerald-500/80">
                            • Read
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};