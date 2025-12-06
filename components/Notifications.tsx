

import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Button, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from './UIShared';
import { Notification } from '../types';
import { dataService } from '../services/dataService';

export const NotificationsPopover: React.FC<{ userId: string }> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await dataService.getNotifications(userId);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await dataService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="absolute top-12 right-0 w-96 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden max-h-[500px] flex flex-col">
        <div className="p-4 border-b border-dark-border bg-black/20 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={loadNotifications}>
            <Icons.RefreshCw className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Icons.RefreshCw className="w-6 h-6 animate-spin text-neon-cyan" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4">
              <Empty className="border-none bg-transparent p-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Icons.Sparkles className="text-gray-500" />
                  </EmptyMedia>
                  <EmptyTitle className="text-base">No Notifications</EmptyTitle>
                  <EmptyDescription>
                    You're all caught up!
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {notifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-neon-cyan/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${!notif.isRead ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-gray-500'}`}>
                      {notif.type === 'REQUEST_SENT' && <Icons.Bell className="w-4 h-4" />}
                      {notif.type === 'REQUEST_APPROVED' && <Icons.Sparkles className="w-4 h-4" />}
                      {notif.type === 'REQUEST_DENIED' && <Icons.X className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white mb-1">{notif.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-gray-600 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-neon-cyan rounded-full mt-1"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};