import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Notification } from '../../types';
import { Bell, CheckCheck, X, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = () => {
    setLoading(true);
    api.get('/notifications')
      .then((res) => setNotifications(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = (id: number) => {
    api.patch(`/notifications/${id}/read`).then(() => {
      setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    });
  };

  const handleMarkAllRead = () => {
    api.patch('/notifications/read-all').then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) handleMarkAsRead(notification.notificationId);
    onClose();
    if (notification.notificationType === 'ITEM_PENDING_VERIFICATION') {
      navigate('/approvals');
    } else if (notification.claimId) {
      navigate('/claims');
    } else if (notification.itemId) {
      navigate(`/items/${notification.itemId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-500/10 transition"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 rounded-xl transition border cursor-pointer ${
                    n.isRead
                      ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                      : 'bg-indigo-950/20 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {n.notificationType.includes('CLAIM') ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-indigo-400" />
                      )}
                      <h4 className="text-sm font-semibold">{n.title}</h4>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
