import { useEffect, useState } from 'react';
import NotificationList from '../components/ui/NotificationList.jsx';
import { fetchNotifications, markNotificationRead } from '../api/notificationService.js';

const Notifications = () => {
  const [items, setItems] = useState([]);

  const loadNotifications = async () => {
    const response = await fetchNotifications();
    setItems(response.data.data.notifications);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    await loadNotifications();
  };

  return (
    <main className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold text-white">Notifications</h1>
        <p className="mt-2 text-slate-400">Track payment reminders, activity alerts, and status updates.</p>
      </section>
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <NotificationList items={items} onMarkRead={handleMarkRead} />
      </section>
    </main>
  );
};

export default Notifications;
