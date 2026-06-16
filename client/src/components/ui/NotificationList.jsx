import { motion } from 'framer-motion';

const NotificationList = ({ items, onMarkRead }) => (
  <div className="space-y-4">
    {items.map((notification) => (
      <motion.div key={notification._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border p-5 ${notification.seen ? 'border-slate-700 bg-slate-900/80' : 'border-cyan-500 bg-cyan-500/10'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{notification.message}</p>
          </div>
          {!notification.seen && (
            <button onClick={() => onMarkRead(notification._id)} className="rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-300 hover:bg-white/20">
              Mark read
            </button>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

export default NotificationList;
